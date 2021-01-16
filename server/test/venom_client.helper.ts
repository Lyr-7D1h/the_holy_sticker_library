import { Message } from "venom-bot";
import { getMessageMock } from "./mock/message.mock";

export class VenomDeviceTest {}

export class VenomClientTest {
  sentTexts: Message[] = [];
  onMessageHandler = (_message: Message): void => {
    throw Error("No onMessageHandler set");
  };

  /*
   * MOCK FUNCTIONS
   */

  /** Mock for onMessage */
  onMessage(cb: (message: Message) => void): void {
    this.onMessageHandler = cb;
  }

  /**
   * Mock for sendText
   * Puts all messages in a queue.
   * You can retrieve these messages using @function sendTestMessage
   */
  sendText(to: string, content: string): void {
    this.sentTexts.push(getMessageMock({ to, content }));
  }

  /*
   * TEST FUNCTIONS
   */

  /**
   * Send a test message as a given user
   * @param p Partial message
   */
  sendTestMessage(p?: Partial<Message>): void {
    this.onMessageHandler(getMessageMock(p));
  }

  /**
   * Receive latest message send by venom
   */
  receiveLatestSendText(): Message {
    const msg = this.sentTexts.shift();
    if (msg) {
      return msg;
    } else {
      throw new Error("No latest message");
    }
  }
}

export interface VenomTest {
  status: "pending" | "loggedin" | "loggedout";
  client: VenomClientTest;
  device: VenomDeviceTest;
}

export default function buildVenom(): VenomTest {
  return {
    client: new VenomClientTest(),
    device: new VenomDeviceTest(),
    status: "loggedin",
  };
}
