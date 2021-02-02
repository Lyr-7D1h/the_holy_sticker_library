import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import WebSocket from 'ws'
import fp from 'fastify-plugin'
import * as crypto from 'crypto'
import {
  SocketError,
  SocketEvent,
  SocketNotFound,
  SocketParsingError,
} from '@shared/socket'
import { AuthenticateRequest, AuthenticateResponse } from '@shared/auth'

interface Handler {
  <S extends SocketEvent>(event: S): Promise<SocketEvent>
}

const handlers: Record<string, Handler> = {}
const adminHandlers: Record<string, Handler> = {}

interface ConnectionInfo {
  isAdmin: boolean
  connection: WebSocket
}

const connections: Record<string, ConnectionInfo> = {}

const authenticate = (event: AuthenticateRequest): AuthenticateResponse => {
  if (
    event.payload.username === 'hsl' &&
    event.payload.password === process.env.PASSWORD
  ) {
    return new AuthenticateResponse(true)
  } else {
    return new AuthenticateResponse(false)
  }
}

function handleEvent(
  fastify: FastifyInstance,
  identifier: string,
  event: SocketEvent
) {
  const connectionInfo = connections[identifier]
  if (!connectionInfo) return

  let isAdmin = connectionInfo.isAdmin
  const connection = connectionInfo.connection

  if (event.type === AuthenticateRequest.type) {
    const res = authenticate(event)
    isAdmin = res.payload
    return connection.send(res.stringify())
  }

  let handler = handlers[event.type]
  if (!handler && isAdmin) handler = adminHandlers[event.type]

  if (handler) {
    handler(event)
      .then((res) => {
        connection.send(res.stringify())
      })
      .catch((e) => {
        connection.send(
          new SocketError('Could not send response', e).stringify()
        )
      })
  } else {
    fastify.log.warn(`Did not find resource: ${event}`)
    connection.send(new SocketNotFound().stringify())
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    addSocketHandler: (type: string, handler: Handler) => void
    addAdminSocketHandler: (type: string, handler: Handler) => void
  }
}

/** Handle new socket connections */
const socketPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const ws = new WebSocket.Server({
    server: fastify.server,
    path: '/ws',
    maxPayload: 1048576,
  })

  ws.on('connection', (connection) => {
    const identifier = crypto.randomBytes(20).toString('hex')
    fastify.log.debug(`New connection '${identifier}'`)
    connections[identifier] = { isAdmin: false, connection }
    connection.onmessage = (e) => {
      let event
      try {
        event = SocketEvent.parse(e.data.toString())
      } catch (e) {
        connection.send(new SocketParsingError('Server: could not parse', e))
        return
      }
      handleEvent(fastify, identifier, event)
    }
  })

  /**
   * Add handler to handle an incomming event
   * @param type Add a handler for the given event
   * @param handler The handler
   */
  function addAdminSocketHandler(type: string, handler: Handler) {
    if (type in handlers) {
      fastify.log.warn(`Type: '${type}' already has an handler`)
    } else {
      handlers[type] = handler
    }
  }

  fastify.decorate('addAdminSocketHandler', addAdminSocketHandler)

  /**
   * Add handler to handle an incomming event
   * @param type Add a handler for the given event
   * @param handler The handler
   */
  function addSocketHandler(type: string, handler: Handler) {
    if (type in handlers) {
      fastify.log.warn(`Type: '${type}' already has an handler`)
    } else {
      handlers[type] = handler
    }
  }

  fastify.decorate('addSocketHandler', addSocketHandler)

  fastify.addHook('onClose', (_, done) => {
    for (const key in connections) {
      connections[key]?.connection.close()
    }
    ws.close(done)
  })

  done()
}

export default fp(socketPlugin, {
  name: 'socket',
})
