import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import fs from "fs";
import path from "path";
import { create, HostDevice, Whatsapp } from "venom-bot";

interface venomInfo {
  status: "pending" | "loggedin" | "loggedout";
  device?: HostDevice;
  client?: Whatsapp;
}

const COMMANDS_DIRECTORY = path.join(__dirname, "../venom_hooks");

const venomInfo: venomInfo = {
  status: "pending",
};

/** Call all venom hooks */
function importVenomHooks(fastify: FastifyInstance) {
  fs.readdir(COMMANDS_DIRECTORY, (err, files) => {
    if (err) fastify.log.error(err.message);

    files.forEach((file) => {
      const filePath = path.join(COMMANDS_DIRECTORY, file);
      fs.stat(filePath, (err, stats) => {
        if (err) fastify.log.error(err.message);

        const imports = [];
        if (stats.isFile()) {
          imports.push(import(path.join(COMMANDS_DIRECTORY, file)));
        }

        Promise.all(imports)
          .then((imports) => {
            imports.forEach((imp) => imp.default(fastify));
          })
          .catch((err) =>
            fastify.log.error("Error importing venom file: ", err)
          );
      });
    });
  });
}

/** Get all information needed */
function getInfo(client: Whatsapp) {
  return Promise.all([client.getHostDevice()]);
}

/** Populate venomInfo and call import */
function handleClient(client: Whatsapp, fastify: FastifyInstance) {
  venomInfo.status = "loggedin";

  // close client when fastify closes
  fastify.addHook("onClose", async () => {
    await client.close();
  });

  getInfo(client)
    .then(([device]) => {
      venomInfo.device = device;

      importVenomHooks(fastify);
    })
    .catch((err) => {
      fastify.log.error(err);
    });
}

function writeQR(qrCode: string) {
  qrCode = qrCode.replace("data:image/png;base64,", "");
  const buffer = Buffer.from(qrCode, "base64");

  fs.writeFileSync("./resources/qr.png", buffer);
}

/**
 * Setting up venom library to work with fastify
 */
const venomPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.decorate("venom", venomInfo);

  create(
    "main",
    (base64QR) => {
      writeQR(base64QR);
    },
    (status) => {
      fastify.log.info(`Venom: Status is "${status}"`);
      if (status === "notLogged") {
        venomInfo.status = "loggedout";
      }
    },
    {
      logQR: false,
      autoClose: 0,
      disableWelcome: true,
      logger: fastify.log,
    }
  )
    .then((client) => handleClient(client, fastify))
    .catch((err) => {
      fastify.log.error(err);
      throw err;
    });

  done();
};

export default fp(venomPlugin, { name: "venom", dependencies: ["db"] });
