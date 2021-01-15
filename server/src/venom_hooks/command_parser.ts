import { FastifyInstance } from "fastify";
import { Message } from "venom-bot";
import query from "./commands/query";
import tag from "./commands/tag";
// import send from "./commands/send";

const parse = (fastify: FastifyInstance, message: Message) => {
  fastify.log.debug(`Parsing: ${message.content} by ${message.from}`);
  const content = message.body.toLowerCase();

  let args = content.split(" ");
  const command = args[0];
  args = args
    .slice(1)
    .map((key) => key.trim())
    .filter((key) => key !== "");

  console.log(args);
  switch (command) {
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
    case "t" || "tag":
      tag(fastify, args);
      break;
    case "s":
      //   send(fastify, args);
      break;
    case "l":
      break;
    default:
      fastify.venom.client.sendText(message.from, "Command not recognized");
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
