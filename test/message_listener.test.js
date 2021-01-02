const helper = require("./helper");
const message_listener = require("../plugins/message_listener");

const tests = [
  (listener) => {
    it("should filter", () => {
      listener({});
    });
  },
];

const testClient = {
  onMessage: (l) => {
    describe("Listener", () => {
      tests.forEach((t) => t(l));
    });
  },
};

const testVenom = {
  group: {
    id: {
      server: "asdf",
    },
  },
  device: {
    id: {},
  },
};

helper(message_listener, testClient, testVenom).listen(5000, (err) => {
  if (err) throw err;
});
