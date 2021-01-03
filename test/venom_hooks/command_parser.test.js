const t = require("tap");

const client = require("../venom_client.helper");
const commandParser = require("../../venom_hooks/command_parser");
const { buildFastify } = require("../fastify.helper");

const TEST_ID = "1234@1234";

t.beforeEach((done) => {
  buildFastify((err, fastify) => {
    if (err) t.error(err);
    commandParser(fastify, client);
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
