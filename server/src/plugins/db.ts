import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import sqlite3 from "sqlite3";

const dbPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const db = new sqlite3.Database("lib.db");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS stickers (id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT NOT NULL, stickerId INTEGER UNIQUE NOT NULL)"
    );
    fastify.decorate("db", db);
    done();
  });
};

export default fp(dbPlugin, { name: "db" });
