import { FastifyPluginCallback } from "fastify"

const webSocketPlugin: FastifyPluginCallback = (fastify, _, done) => {
  done()
}

export default webSocketPlugin
