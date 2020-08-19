const fp = require("fastify-plugin");

module.exports = fp(
  async (instance) => {
    instance.venom.onCreate().then((client) => {
      client.onMessage((message) => {
        if (instance.venom.device.id && instance.venom.group.id) {
          if (message.isGroupMsg) {
            if (message.chat.contact.id === venomInfo.group.id._serialized) {
              client.sendText(message.from, "Message Received");
            }
          }
        }
      });
    });
  },
  {
    name: "message_listener",
    dependencies: ["venom"],
  }
);
