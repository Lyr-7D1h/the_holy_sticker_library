import { FastifyInstance } from "fastify/types/instance";

const tag = (_fastify: FastifyInstance, _keywords: string[]) => {
  console.log(_keywords);
  // TODO: fetch stickers
};

export default tag;
