let onMessageHandler;

export interface TestMessage {
  id: string;
  content: string;
  chat?: {
    contact: {
      id: string;
    };
  };
}

const sendTexts: TestMessage[] = [];
/*
 * MOCK FUNCTIONS
 */

/** Mock for onMessage */
export function onMessage(cb: () => void): void {
  onMessageHandler = cb;
}

/**
 * Mock for sendText
 * Puts all messages in a queue.
 * You can retrieve these messages using @function sendTestMessage
 */
export function sendText(contactId: string, content: string): void {
  sendTexts.push({ id: contactId, content });
}

/*
 * TEST FUNCTIONS
 */

/**
 * Send a test message as a given user
 * @param {string} text Content of the message
 */
export function sendTestMessage(id: string, content: string): void {
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
}

/**
 * Receive latest message send by venom
 */
export function receiveLatestSendText(): TestMessage {
  return sendTexts.shift();
}
