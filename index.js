const packageJson = require("./package.json");
const VERSION = packageJson.version;
const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.type("text/plain");
  res.send("Wedding backend is up. Version: " + VERSION);
});

app.post("/contact", (req, res) => {
  res.type("application/json");
  res.send(req.body);
});

app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});

app.listen(port, () =>
  console.log(`Express started on ${port}; ` + `press Ctrl-C to terminate.`)
);
