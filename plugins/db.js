const sqlite3 = require("sqlite3");
const fp = require("fastify-plugin");

module.exports = fp(
  (fastify, _, done) => {
    const db = new sqlite3.Database("lib.db");

    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS stickers (id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT NOT NULL, stickerId INTEGER UNIQUE NOT NULL)"
      );
      fastify.decorate("db", db);
      done();
    });
  },
  { name: "db" }
);
