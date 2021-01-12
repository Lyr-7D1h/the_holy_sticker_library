import Fastify from "fastify";
import fastifyAutoload from "fastify-autoload";
import path from "path";
import process from "process";
import fastifyFormBody from "fastify-formbody";
import fastifySensible from "fastify-sensible";
import pino from "pino";
import fastifyStatic from "fastify-static";

/*
 * Server Setup
 */

const fastify = Fastify({
  logger: pino({
    prettyPrint: process.env.NODE_ENV === "development",
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  }),
  disableRequestLogging: true,
});

fastify
  .register(fastifyFormBody)

  .register(fastifySensible)

  .register(fastifyStatic, {
    root: path.join(__dirname, "../resources"),
    prefix: "/resources",
  })

  .register(fastifyAutoload, {
    dir: path.join(path.resolve(), "src/plugins"),
  })
  .register(fastifyAutoload, {
    dir: path.join(path.resolve(), "src/routes"),
    options: {
      prefix: "/api",
    },
  })

  .listen(5000, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(fastify.printRoutes());
    }
  });
