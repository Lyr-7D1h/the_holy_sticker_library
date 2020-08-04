module.exports = async (server) => {
  server.get("/test", (req, res) => {
    res.send("test");
  });
};
