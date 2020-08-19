const fastify = require("fastify")({ logger: true });
const fp = require("fastify-plugin");

const venom = require("../plugins/venom");

module.exports = (plugin, testClient, testVenom) => {
  fastify.register(
    fp(
      async (instance) => {
        instance.decorate(
          "venom",
          Object.assign(testVenom, {
            onCreate: () =>
              new Promise((res) => {
                res(testClient);
              }),
          })
        );
      },
      {
        name: "venom",
      }
    )
  );

  fastify.register(plugin);

  return fastify;
};
