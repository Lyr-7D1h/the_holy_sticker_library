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

t.test("Command Parser argument validation works well", (t) => {
  t.plan(2);

  sendTestMessage(TEST_ID, "q");
  t.equal(
    receiveLatestSendText().content,
    "No keywords given",
    "Check for keywords"
  );

  sendTestMessage(TEST_ID, "q ");
  t.equal(
    receiveLatestSendText().content,
    "No keywords given",
    "Check for keywords"
  );
});
