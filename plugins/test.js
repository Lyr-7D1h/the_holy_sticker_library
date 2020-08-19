const fp = require("fastify-plugin");

module.exports = fp(
  async (instance) => {
    instance.venom.onCreate().then((client) => {
      setTimeout(() => {
        console.log(instance.venom.group);
        client.sendText(instance.venom.group.id._serialized, "asdf");
      }, 500);
    });
  },
  {
    name: "message_listener",
    dependencies: ["venom"],
  }
);
