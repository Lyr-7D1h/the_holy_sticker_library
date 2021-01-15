import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const venom = {
  device: {},
  group: {},
  status: "pending", // pending, loggedin, loggedout
  onCreate: () =>
    new Promise<void>((res) => {
      res();
    }),
};

/**
 * Fastify instance with venomInfo
 */
export function buildFastify(
  cb: (_error: Error, _fastify: FastifyInstance) => void
): void {
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
}
