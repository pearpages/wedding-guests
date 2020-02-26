const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 3000;

function serveStaticFile(res, path, contentType, responseCode = 200) {
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("500 - Internal Error");
    }
    res.writeHead(responseCode, { "Content-Type": contentType });
    res.end(data);
  });
}

function makeServer() {
  function normalizeUrl(req) {
    return req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
  }

  return http.createServer((req, res) => {
    const normalizedUrl = normalizeUrl(req);

    switch (normalizedUrl) {
      case "":
        serveStaticFile(res, "/public/home.html", "text/html");
        break;
      case "/about":
        serveStaticFile(res, "/public/about.html", "text/html");
        break;
      case "/img/logo.png":
        serveStaticFile(res, "/public/img/logo.png", "image/png");
        break;
      default:
        serveStaticFile(res, "/public/404.html", "text/html");
        break;
    }
  });
}

makeServer().listen(port, () =>
  console.log(
    `server started on port ${port}; ` + "press Ctrl-C to terminate...."
  )
);
