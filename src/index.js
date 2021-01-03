const fastifyAutoload = require("fastify-autoload");
const path = require("path");
const process = require("process");

/*
 * Server Setup
 */

const fastify = require("fastify")({
  logger: {
    prettyPrint: process.env.NODE_ENV === "development",
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  },
  disableRequestLogging: true,
});

fastify
  .register(require("fastify-formbody"))

  .register(require("fastify-sensible"))

  .register(fastifyAutoload, {
    dir: path.join(path.resolve(), "src/plugins"),
  })
  .register(fastifyAutoload, {
    dir: path.join(path.resolve(), "src/routes"),
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
