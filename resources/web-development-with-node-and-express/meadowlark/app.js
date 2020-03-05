const express = require("express");
const expressHandlebars = require("express-handlebars");
const handlers = require("./lib/handlers");

const app = express();
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.use(express.static(__dirname + "/public"));

app.use(handlers.notFound);

app.use(handlers.serverError);

exports.app = app;
