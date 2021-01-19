import { FastifyInstance, FastifyPluginCallback } from "fastify"
import WebSocket, { Data } from "ws"
import fp from "fastify-plugin"

type Handler<DataType> = (data: DataType) => Promise<unknown>
const handlers: Record<string, Handler<unknown>> = {}

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

  const handler = handlers[event]

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

function addSocketHandler(event: string, handler: Handler<unknown>) {
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
