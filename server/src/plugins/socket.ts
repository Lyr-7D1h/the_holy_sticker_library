import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import WebSocket, { Data } from 'ws'
import fp from 'fastify-plugin'
import {
  SocketErrorEvent,
  SocketEvent,
  SocketNotFoundEvent,
  SocketParsingError,
} from '@shared/socket'

interface Handler {
  <S extends SocketEvent>(event: S): Promise<SocketEvent>
}

const handlers: Record<string, Handler> = {}

function parseMessage(
  fastify: FastifyInstance,
  connection: WebSocket,
  rawData: Data
) {
  let event: SocketEvent
  try {
    event = SocketEvent.parse(rawData.toString())
  } catch (e) {
    connection.send(new SocketParsingError(e))
    return
  }

  const handler = handlers[event.type]

  if (handler) {
    handler(event)
      .then((res) => {
        connection.send(res.stringify())
      })
      .catch((error) => {
        connection.send(new SocketErrorEvent(error.message).stringify())
      })
  } else {
    fastify.log.warn(`Did not find resource: ${event}`)
    connection.send(new SocketNotFoundEvent().stringify())
  }
}

/**
 * Add handler to handle an incomming event
 * @param event Add a handler for the given event
 * @param handler The handler
 */
function addSocketHandler(event: string, handler: Handler) {
  handlers[event] = handler
}

declare module 'fastify' {
  interface FastifyInstance {
    addSocketHandler: typeof addSocketHandler
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
      parseMessage(fastify, conn, e.data)
    }
  })

  fastify.decorate('addSocketHandler', addSocketHandler)

  done()
}

export default fp(socketPlugin, {
  name: 'socket',
})
