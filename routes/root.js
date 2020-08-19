module.exports = async (fastify) => {
  fastify.get("/", (req, res) => {
    console.log(fastify.venom);
    res.type("text/html");
    res.send(
      `<html><body>${fastify.venom.logged ? "LOGGED IN" : "LOGGED OUT"}
      </br></br><img src="/qr" />
      </body></html>`
    );
  });
};
