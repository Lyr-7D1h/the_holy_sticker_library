module.exports = async (fastify) => {
  fastify.get("/", (req, res) => {
    console.log(fastify.venom);
    res.type("text/html");
    res.send(
      `<html><body>${fastify.venom.logged ? "Logged in" : "Logged out"}${
        fastify.venom.logged ? "" : '</br></br><img src="/qr" />'
      }</body></html>`
    );
  });
};
