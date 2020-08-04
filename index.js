require("dotenv").config();

const fastifyAutload = require("fastify-autoload");
const path = require("path");

const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-env"), {
  schema: {
    ACCOUNT_SID: { type: "string" },
    AUTH_TOKEN: { type: "string" },
  },
});

fastify.register(require("fastify-formbody"));

fastify.register(fastifyAutload, {
  dir: path.join(__dirname, "routes"),
});

fastify.listen(5000, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(fastify.printRoutes());

  fastify.log.info("Listening for messages...");
});

// const client = require("twilio")(
//   process.env.ACCOUNT_SID,
//   process.env.AUTH_TOKEN
// );

// client.messages
//   .create({
//     from: "whatsapp:+14155238886", //"whatsapp:+12055765697",
//     to: "whatsapp:+310658866140",
//     body: "Test",
//   })
//   .then((msg) => {
//     console.log(msg);
//   });
