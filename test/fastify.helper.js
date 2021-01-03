const fp = require("fastify-plugin");
const Fastify = require("fastify");

let venom = {
  device: {},
  group: {},
  status: "pending", // pending, loggedin, loggedout
  onCreate: () =>
    new Promise((res) => {
      onCreateResolver = res;
    }),
};

/**
 * Fastify instance with venomInfo
 */
module.exports = {
  buildFastify: (cb) => {
    const fastify = Fastify({ logger: true });

    const venomPlugin = fp(
      async (fastify) => {
        fastify.decorate("venom", venom);
      },
      {
        name: "venom",
      }
    );

    fastify.register(venomPlugin);

    fastify.ready((err) => cb(err, fastify));
  },
};
