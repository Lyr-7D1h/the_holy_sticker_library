const t = require("tap");

const commandParser = require("../../src/venom_hooks/command_parser");

const client = require("../venom_client.helper");
const { buildFastify } = require("../fastify.helper");

const TEST_ID = "1234@1234";

t.beforeEach((done) => {
  buildFastify((err, fastify) => {
    if (err) t.error(err);
    commandParser(fastify, client);
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
