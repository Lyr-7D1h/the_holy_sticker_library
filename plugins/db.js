const sqlite3 = require("sqlite3");

module.exports = async (instance) => {
  const db = new sqlite3.Database("db");

  db.serialize(() => {
    instance.decorate("db", db);
  });
};
