let onMessageHandler;
let sendTexts = [];
/*
 * MOCK FUNCTIONS
 */

/** Mock for onMessage */
exports.onMessage = (cb) => {
  onMessageHandler = cb;
};

/**
 * Mock for sendText
 * Puts all messages in a queue.
 * You can retrieve these messages using @function sendTestMessage
 */
exports.sendText = (contactId, content) => {
  sendTexts.push({ id: contactId, content });
};

/*
 * TEST FUNCTIONS
 */

/**
 * Send a test message as a given user
 * @param {string} text Content of the message
 */
exports.sendTestMessage = (id, content) => {
  if (!onMessageHandler) {
    throw Error("No onMessageHandler set");
  }

  onMessageHandler({
    chat: {
      contact: {
        id,
      },
    },
    content,
  });
};

/**
 * Receive latest message send by venom
 */
exports.receiveLatestSendText = () => {
  return sendTexts.shift();
};
