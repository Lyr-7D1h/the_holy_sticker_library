// require("dotenv").config();

const fastifyAutoload = require("fastify-autoload");
const path = require("path");

const fastify = require("fastify")({ logger: true });

fastify
  .register(require("fastify-env"), {
    schema: {
      // ACCOUNT_SID: { type: "string" },
      // AUTH_TOKEN: { type: "string" },
    },
  })

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

    console.log(fastify.printRoutes());
  });
