import fastifyAutoload from "fastify-autoload"
import path from "path"
import process from "process"
import fastifySensible from "fastify-sensible"
import pino from "pino"
import fastifyStatic from "fastify-static"
import Fastify from "fastify"

const HOST = process.env.HOST || "0.0.0.0"
const PORT = process.env.PORT || 5000

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

  .register(fastifyStatic, {
    root: path.join(__dirname, "../resources"),
    prefix: "/resources",
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, "./plugins"),
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, "./socket_resources"),
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, "./routes"),
    options: {
      prefix: "/api",
    },
  })

  .listen(PORT, HOST, (err) => {
    if (err) {
      fastify.log.error(err.message)
      process.exit(1)
    }

    if (process.env.NODE_ENV === "development") {
      console.log(fastify.printRoutes())
    }
  })
