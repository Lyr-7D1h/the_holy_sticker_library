import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import WebSocket from 'ws'
import fp from 'fastify-plugin'
import {
  SocketError,
  SocketEvent,
  SocketNotFound,
  SocketParsingError,
} from '@shared/socket'

interface Handler {
  <S extends SocketEvent>(event: S): Promise<SocketEvent>
}

const handlers: Record<string, Handler> = {}

function handleEvent(
  fastify: FastifyInstance,
  connection: WebSocket,
  event: SocketEvent
) {
  const handler = handlers[event.type]

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
  }
}

/** Handle new socket connections */
const socketPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const ws = new WebSocket.Server({
    server: fastify.server,
    path: '/ws',
    maxPayload: 1048576,
    verifyClient: (_info, next) => {
      // TODO: validate connection
      next(true)
    },
  })

  ws.on('connection', (conn) => {
    fastify.log.debug(`New connection`)
    conn.onmessage = (e) => {
      let event
      try {
        event = SocketEvent.parse(e.data.toString())
      } catch (e) {
        conn.send(new SocketParsingError('Server: could not parse', e))
        return
      }
      handleEvent(fastify, conn, event)
    }
  })

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

  done()
}

export default fp(socketPlugin, {
  name: 'socket',
})
