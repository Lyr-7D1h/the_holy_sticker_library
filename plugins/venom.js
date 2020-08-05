const venom = require("venom-bot");
const fs = require("fs");
const fp = require("fastify-plugin");

const groupName = "Holy Sticker Library";

let venomInfo = { device: {}, group: {}, logged: false };

module.exports = fp(async (instance) => {
  instance.decorate("venom", {
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
          const group = groups.find((group) => group.name === groupName);
          if (group) {
            resolve([device, group]);
          } else {
            console.log(device);
            client
              .createGroup(groupName, [`${device.me.user}@${device.me.server}`])
              .then((group) => {
                console.log("test");
                resolve([device, group]);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  };

  const handler = (client) => {
    venomInfo.logged = true;

    getInfo(client)
      .then(([device, group]) => {
        venomInfo.device = device;
        venomInfo.group = group;
      })
      .catch((err) => {
        throw err;
      });

    client.onMessage((message) => {
      if (venomInfo.device.id && venomInfo.group.id) {
        if (message.isGroupMsg) {
          if (message.chat.contact.id === venomInfo.group.id._serialized) {
            client.sendText(message.from, "Message Received");
          }
        }
      }
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
          venomInfo.logged = status === "isLogged";
        },
        {
          disableSpins: true,
          logQR: false,
        }
      )
      .then((client) => handler(client))
      .catch((err) => {
        throw er;
      });

    const writeQR = (qrCode) => {
      qrCode = qrCode.replace("data:image/png;base64,", "");
      const buffer = Buffer.from(qrCode, "base64");

      fs.writeFileSync("./resources/qr", buffer);
    };
  };

  start();
});
