const fs = require("fs");
const path = require("path");

module.exports = async (fastify) => {
  fastify.get("/qr", async function (req, res) {
    fs.readFile(path.join(__dirname, "../resources/qr"), (err, data) => {
      if (err) {
        fastify.log.error(err);
        res.internalServerError();
      } else {
        res.type("image/png");
        res.send(data);
        // res.send(data);
      }
    });

    await res;
  });
};
