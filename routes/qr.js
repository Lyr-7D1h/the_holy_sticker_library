const fs = require("fs");
const path = require("path");

/**
 * Return QR code as image
 */
module.exports = async (fastify) => {
  fastify.get("/qr", async (_, res) => {
    if (fastify.venom.status === "loggedout") {
      fs.readFile(path.join(path.resolve(), "/resources/qr"), (err, data) => {
        if (err) {
          fastify.log.error(err);
          res.internalServerError();
        } else {
          res.type("image/png");
          res.send(data);
        }
      });
    } else {
      res.send("");
    }

    await res;
  });
};
