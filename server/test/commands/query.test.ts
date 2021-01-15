import t from "tap";

import { buildFastify } from "../fastify.helper";
import commandParser from "../../src/venom_hooks/command_parser";
import { receiveLatestSendText, sendTestMessage } from "../venom_client.helper";

const TEST_ID = "1234@1234";

t.beforeEach((done) => {
  buildFastify((err, fastify) => {
    if (err) t.error(err);
    commandParser(fastify);
    done();
  });
});

t.test("Query returns stickers with corresponding tags", (t) => {
  t.plan(1);

  sendTestMessage(TEST_ID, "q test, asdf");

  const latestMessage = receiveLatestSendText();

  t.notEqual(latestMessage, "Command not recognized", "Recognizes message");
  // TODO: test query functionality
});
