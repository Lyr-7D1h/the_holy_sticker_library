module.exports = async (server) => {
  server.post("/whatsapp", (req, res) => {
    console.log(req);
    console.log(req.body);
    res.send("test");
  });
  server.post("/whatsapp/status", (req, res) => {
    console.log(req);
    console.log(req.body);
    res.send("test");
  });
};
