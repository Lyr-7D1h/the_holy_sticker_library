import { FastifyInstance } from "fastify";
import { Message } from "venom-bot";
import query from "./commands/query";
import send from "./commands/send";

const parse = (fastify: FastifyInstance, message: Message) => {
  fastify.log.debug(`Parsing: ${message.content} by ${message.from}`);
  const content = message.content.toLowerCase();

  const args = content
    .slice(1)
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key !== "");

  switch (content.charAt(0)) {
    case "q":
      if (args.length == 0) {
        fastify.venom.client.sendText(
          message.chat.contact.id,
          "No keywords given"
        );
        break;
      }

      query(fastify, args);
      break;
    case "s":
      send();
      break;
    case "l":
      break;
    default:
    // TODO: send pm
    // client.sendText(
    //   fastify.venom.group.id._serialized,
    //   "Command not recognized"
    // );
  }
};

/**
 * Parse and validate incomming messages
 */
export default (fastify: FastifyInstance): void => {
  fastify.venom.client.onMessage((message) => {
    parse(fastify, message);
  });
};
