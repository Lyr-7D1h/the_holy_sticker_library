module.exports = async (server) => {
  server.post("/whatsapp", (req, res) => {
    console.log(req.body);
    console.log(req.headers);
    res.send("test");
  });
  server.post("/whatsapp/status", (req, res) => {
    // console.log(req.body);
    res.send("test");
  });
};
