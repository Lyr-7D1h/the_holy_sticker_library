let active_ids = [];

module.exports = (instance, client) => {
  const query = (keywords) => {
    console.log(keywords);
    // TODO: fetch stickers
  };

  const send = (tags) => {};

  const parse = (content) => {
    content = content.toLowerCase();
    switch (content.charAt(0)) {
      case "q":
        const keywords = content
          .slice(1)
          .split(",")
          .map((key) => key.trim());

        if (keywords.len() == 0) {
          client.sendText(
            instance.venom.group.id._serialized,
            "No keywords given"
          );
          break;
        }

        query(keywords);
        break;
      case "s":
        send();
        break;
      case "l":
        break;
      default:
        client.sendText(
          instance.venom.group.id._serialized,
          "Command not recognized"
        );
    }
  };

  client.onMessage((message) => {
    if (instance.venom.device.id && instance.venom.group.id) {
      if (message.isGroupMsg) {
        console.log(message.chat.contact.id);
        if (message.chat.contact.id === instance.venom.group.id._serialized) {
          parse(message.content);
        }
      }
    }
  });
};
