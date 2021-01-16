export interface TestMessage {
  id: string;
  content: string;
  chat?: {
    contact: {
      id: string;
    };
  };
}

export class VenomDeviceTest {}

/*
 * MOCK FUNCTIONS
 */
export class VenomClientTest {
  sendTexts: TestMessage[] = [];
  onMessageHandler = (_message: TestMessage): void => {
    throw Error("No onMessageHandler set");
  };

  /** Mock for onMessage */
  onMessage(cb: (message: TestMessage) => void): void {
    this.onMessageHandler = cb;
  }

  /**
   * Mock for sendText
   * Puts all messages in a queue.
   * You can retrieve these messages using @function sendTestMessage
   */
  sendText(contactId: string, content: string): void {
    this.sendTexts.push({ id: contactId, content });
  }

  /*
   * TEST FUNCTIONS
   */

  /**
   * Send a test message as a given user
   * @param {string} id Id of the message
   * @param {string} text Content of the message
   */
  sendTestMessage(id: string, content: string): void {
    this.onMessageHandler({
      id: id,
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
  receiveLatestSendText(): TestMessage {
    const msg = this.sendTexts.shift();
    if (msg) {
      return msg;
    } else {
      throw Error("No latest message");
    }
  }
}

export interface VenomTest {
  status: "pending" | "loggedin" | "loggedout";
  client: VenomClientTest;
  device: VenomDeviceTest;
}

export default (): VenomTest => {
  return {
    client: new VenomClientTest(),
    device: new VenomDeviceTest(),
    status: "loggedin",
  };
};
