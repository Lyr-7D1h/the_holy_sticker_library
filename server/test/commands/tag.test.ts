import t from "tap";

import { buildFastify } from "../fastify.helper";
import commandParser from "../../src/venom_hooks/command_parser";
import { VenomClientTest } from "../venom_client.helper";

let client: VenomClientTest;
t.beforeEach((done) => {
  buildFastify((err, fastify) => {
    if (err) t.error(err);
    commandParser(fastify);
    client = fastify.venom.client;
    done();
  });
});

t.test("Recognizes tag command", (t) => {
  t.plan(1);

  client.sendTestMessage({ body: "t" });

  //   client.receiveLatestSendText();
  try {
    client.receiveLatestSendText();
  } catch (err) {
    t.equal(err.message, "No latest message", "Recognizes message");
  }
});
