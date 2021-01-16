import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import buildVenom, { VenomTest } from "./venom_client.helper";

declare module "fastify" {
  interface FastifyInstance {
    venom: VenomTest;
  }
}

/**
 * Fastify instance with venom
 */
export function buildFastify(
  // eslint-disable-next-line no-unused-vars
  cb: (error: Error, fastify: FastifyInstance) => void
): void {
  const fastify = Fastify({ logger: true });

  const venomPlugin = fp(
    async (fastify) => {
      fastify.decorate("venom", buildVenom());
    },
    {
      name: "venom",
    }
  );

  fastify.register(venomPlugin);

  fastify.ready((err) => cb(err, fastify));
}
