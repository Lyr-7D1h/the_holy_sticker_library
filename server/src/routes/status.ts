import { FastifyPluginCallback } from "fastify"

/**
 * Return current status. (If logged in or not)
 */
const status: FastifyPluginCallback = (fastify, _, done) => {
  fastify.get("/status", { logLevel: "trace" }, (_, res) => {
    res.send({ status: fastify.venom.status })
  })
  done()
}

export default status
