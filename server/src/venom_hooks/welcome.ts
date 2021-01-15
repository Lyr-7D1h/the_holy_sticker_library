import { FastifyInstance } from "fastify";

/**
 * Send welcome message to new contacts
 */
export default (fastify: FastifyInstance): void => {
  //   const client = fastify.venom.client;
  fastify.venom.client.onMessage((message) => {
    if (!message.isGroupMsg) {
      fastify.log.debug(`${message.from}`);
    }
    // message.sender.client
    //   .getAllMessagesInChat(message.chatId, false, false)
    //   .then((msgs) => {
    //     console.log(msgs);
    //   });
  });
};
