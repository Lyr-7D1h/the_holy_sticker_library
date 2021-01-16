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

t.test("Command Parser argument validation works well", (t) => {
  t.plan(2);

  client.sendTestMessage(TEST_ID, "q");
  t.equal(
    client.receiveLatestSendText().content,
    "No keywords given",
    "Check for keywords"
  );

  client.sendTestMessage(TEST_ID, "q ");
  t.equal(
    client.receiveLatestSendText().content,
    "No keywords given",
    "Check for keywords"
  );
});
