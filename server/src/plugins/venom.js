const venom = require("venom-bot");
const fs = require("fs");
const fp = require("fastify-plugin");
const { Buffer } = require("buffer");

const GROUP_NAME = "Holy Sticker Library";

let onCreateResolver;

let venomInfo = {
  device: {},
  group: {},
  status: "pending", // pending, loggedin, loggedout
  onCreate: () =>
    new Promise((res) => {
      onCreateResolver = res;
    }),
};

/**
 * Setting up venom library to work with fastify
 */
module.exports = fp(
  (fastify, _, done) => {
    fastify.decorate("venom", {
      getter() {
        return venomInfo;
      },
      setter(info) {
        venomInfo = info;
      },
    });

    const getInfo = (client) => {
      return new Promise((resolve, reject) => {
        Promise.all([client.getHostDevice(), client.getAllGroups()])
          .then(([device, groups]) => {
            const group = groups.find((group) => group.name === GROUP_NAME);
            if (group) {
              resolve([device, group]);
            } else {
              client
                .createGroup(GROUP_NAME, [
                  `${device.me.user}@${device.me.server}`,
                ])
                .then((group) => {
                  resolve([device, group]);
                })
                .catch(reject);
            }
          })
          .catch(reject);
      });
    };

    const handler = (client) => {
      venomInfo.status = "loggedin";
      getInfo(client)
        .then(([device, group]) => {
          venomInfo.device = device;
          venomInfo.group = group;

          // Call onCreate hook when venomInfo is filled
          if (onCreateResolver) onCreateResolver(client);
        })
        .catch((err) => {
          throw err;
        });
    };

    const start = () => {
      venom
        .create(
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
            disableSpins: true,
            logQR: false,
          }
        )
        .then((client) => handler(client))
        .catch((err) => {
          throw err;
        });

      const writeQR = (qrCode) => {
        qrCode = qrCode.replace("data:image/png;base64,", "");
        const buffer = Buffer.from(qrCode, "base64");

        fs.writeFileSync("./resources/qr.png", buffer);
      };
      done();
    };

    start();
  },
  { name: "venom", dependencies: ["db"] }
);
