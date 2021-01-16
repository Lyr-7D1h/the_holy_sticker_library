import t from "tap";

import { buildFastify } from "../fastify.helper";
import commandParser from "../../src/venom_hooks/command_parser";
import { VenomClientTest } from "../venom_client.helper";
import { Message } from "venom-bot";

let client: VenomClientTest;
let receiveMsg: Message;
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

  client.sendTestMessage({ body: "q" });

  receiveMsg = client.receiveLatestSendText();
  t.equal(receiveMsg.content, "No keywords given", "Check for keywords");

  client.sendTestMessage({ body: "q " });
  receiveMsg = client.receiveLatestSendText();
  t.equal(receiveMsg.content, "No keywords given", "Check for keywords");
});
