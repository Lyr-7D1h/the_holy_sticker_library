import t from "tap";

import { buildFastify } from "../fastify.helper";
import commandParser from "../../src/venom_hooks/command_parser";
import { VenomClientTest } from "../venom_client.helper";

const TEST_ID = "1234@1234";

let client: VenomClientTest;
t.beforeEach((done) => {
  buildFastify((err, fastify) => {
    if (err) t.error(err);
    commandParser(fastify);
    client = fastify.venom.client;
    done();
  });
});

t.test("Query returns stickers with corresponding tags", (t) => {
  t.plan(1);

  client.sendTestMessage(TEST_ID, "q test, asdf");

  const latestMessage = client.receiveLatestSendText();

  t.notEqual(latestMessage, "Command not recognized", "Recognizes message");
  // TODO: test query functionality
});
