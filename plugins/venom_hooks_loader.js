const fp = require("fastify-plugin");
const fs = require("fs");
const path = require("path");

const COMMANDS_DIRECTORY = path.join(path.resolve(), "/venom_hooks");

/**
 * Load all venom hooks when venom client has been created
 */
module.exports = fp(
  async (fastify) => {
    fastify.venom.onCreate().then((client) => {
      setTimeout(() => {
        fs.readdir(COMMANDS_DIRECTORY, (err, files) => {
          if (err) fastify.log.error(err);

          files.forEach((file) => {
            const filePath = path.join(COMMANDS_DIRECTORY, file);
            fs.stat(filePath, (err, stats) => {
              if (err) fastify.log.error(err);

              if (stats.isFile()) {
                require(path.join(COMMANDS_DIRECTORY, file))(fastify, client);
              }
            });
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
