import { FastifyInstance, FastifyPluginCallback } from "fastify"
import WebSocket, { Data } from "ws"
import fp from "fastify-plugin"

export type Handler<T, S> = (data: T) => Promise<S>

export type EventData = Record<string, unknown> | unknown[]
export type Event = { sender: string; receiver: string }

const handlers: Record<string, Handler<EventData, EventData>> = {}

function stringify(event: string, data: unknown) {
  return JSON.stringify({
    event,
    data,
  })
}

function parseMessage(
  fastify: FastifyInstance,
  connection: WebSocket,
  rawData: Data
) {
  // TODO: check if fails
  const { event, data } = JSON.parse(rawData.toString())

  const handler = handlers[event.sender]

  if (handler) {
    handler(data)
      .then((result) => {
        connection.send(stringify(event, result))
      })
      .catch((error) => {
        if (!error) {
          error = "Something went wrong"
        } else if (error.message) {
          error = error.message
        }

        connection.send(stringify("socket/error", { error }))
      })
  } else {
    fastify.log.warn(`Did not find resource: ${event}`)
    connection.send(stringify("socket/notFound", { event }))
  }
}

/**
 * Add handler to handle an incomming event
 * @param event Add a handler for the given event
 * @param handler The handler
 */
function addSocketHandler(
  event: string,
  handler: Handler<EventData, EventData>
) {
  handlers[event] = handler
}

declare module "fastify" {
  interface FastifyInstance {
    addSocketHandler: typeof addSocketHandler
  }
}

/** Handle new socket connections */
const socketPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const ws = new WebSocket.Server({
    server: fastify.server,
    path: "/ws",
    maxPayload: 1048576,
    verifyClient: (_info, next) => {
      // TODO: validate connection
      next(true)
    },
  })

  ws.on("connection", (conn) => {
    fastify.log.debug(`New connection`)
    conn.onmessage = (e) => {
      parseMessage(fastify, conn, e.data)
    }
  })

  fastify.decorate("addSocketHandler", addSocketHandler)

  done()
}

export default fp(socketPlugin, {
  name: "socket",
})
