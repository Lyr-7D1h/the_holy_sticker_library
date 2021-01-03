/**
 * Return current status. (If logged in or not)
 */
module.exports = async (fastify) => {
  fastify.get("/status", { logLevel: "trace" }, (_, res) => {
    res.send({ status: fastify.venom.status });
  });
};
