const fp = require("fastify-plugin");
const fs = require("fs");
const path = require("path");

const COMMANDS_DIRECTORY = path.join(__dirname, "../commands");

module.exports = fp(
  async (fastify) => {
    fastify.venom.onCreate().then((client) => {
      setTimeout(() => {
        fs.readdir(COMMANDS_DIRECTORY, (err, files) => {
          if (err) fastify.log.error(err);

          files.forEach((file) => {
            require(path.join(COMMANDS_DIRECTORY, file))(fastify, client);
          });
        });
      }, 500);
    });
  },
  {
    name: "message_listener",
    dependencies: ["venom"],
  }
);
