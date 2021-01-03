/**
 * Return status page
 */
module.exports = async (fastify) => {
  fastify.get("/", (req, res) => {
    res.type("text/html");
    res.send(
      `<!DOCTYPE html>
<html>
<head>
<title>Holy Sticker Library</title>
<meta charset="UTF-8">
</head>
<body style="text-align: center;">
  <div style="margin: 20px" id="status">PENDING</div>
  <img style="display: none;" id="qr" src="/qr" />
  <script>
    const status = document.getElementById('status');
    const qr = document.getElementById('qr');
    const update = () => {
      fetch('/status').then((res) => {
        res.json().then(res => {
          if (res.status === "loggedin") {
            status.innerHTML = "LOGGED IN"
          } else if (res.status === "loggedout") { 
            qr.style.display = "inline"
            status.innerHTML = "LOGGED OUT"
          } else {
            status.innerHTML = "PENDING"
          }
        })
      }).catch(err => {
        status.innerHTML = err.message
      })
    }
    update()
    setInterval(() => {
      update()
    }, 3000)
  </script>
</body>
</html>`
    );
  });
};
