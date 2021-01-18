import Fastify from "fastify"
import fastifyAutoload from "fastify-autoload"
import path from "path"
import process from "process"
import fastifySensible from "fastify-sensible"
import pino from "pino"
import fastifyStatic from "fastify-static"
import fastifyWebsocket from "fastify-websocket"

/*
 * Server Setup
 */

const fastify = Fastify({
  logger: pino({
    prettyPrint: process.env.NODE_ENV === "development",
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  }),
  disableRequestLogging: true,
})

fastify
  .register(fastifySensible)

  .register(fastifyWebsocket, {
    handle: (conn) => {
      fastify.log.info("Connection made")
      conn.pipe(conn)
    },
    options: {
      maxPayload: 1048576, // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
      port: 5001,
      path: "/ws",
      verifyClient: function (info, next) {
        fastify.log.info("Connection made")
        if (info.req.headers["x-fastify-header"] !== "fastify is awesome !") {
          return next(false) // the connection is not allowed
        }
        next(true) // the connection is allowed
      },
    },
  })

  .register(fastifyStatic, {
    root: path.join(__dirname, "../resources"),
    prefix: "/resources",
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, "./plugins"),
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, "./routes"),
    options: {
      prefix: "/api",
    },
  })

  .listen(5000, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    if (process.env.NODE_ENV === "development") {
      console.log(fastify.printRoutes())
    }
  })
