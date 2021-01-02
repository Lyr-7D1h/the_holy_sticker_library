const fastifyAutoload = require("fastify-autoload");
const path = require("path");

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
    dir: path.join(__dirname, "plugins"),
  })
  .register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
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
