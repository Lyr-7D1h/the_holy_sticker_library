import query from "./commands/query";
import send from "./commands/send";

/**
 * Parse and validate incomming messages
 */
export default (fastify, client) => {
  const parse = (message) => {
    const content = message.content.toLowerCase();

    const args = content
      .slice(1)
      .split(",")
      .map((key) => key.trim())
      .filter((key) => key !== "");

    switch (content.charAt(0)) {
      case "q":
        if (args.length == 0) {
          client.sendText(message.chat.contact.id, "No keywords given");
          break;
        }

        query(fastify, client, args);
        break;
      case "s":
        send();
        break;
      case "l":
        break;
      default:
        client.sendText(
          fastify.venom.group.id._serialized,
          "Command not recognized"
        );
    }
  };

  client.onMessage((message) => {
    // if (fastify.venom.device.id && fastify.venom.group.id) {
    //   if (message.isGroupMsg) {
    //     if (message.chat.contact.id === fastify.venom.group.id._serialized) {
    parse(message);
    //     }
    //   }
    // }
  });
};
