const { getRandomFortune } = require("./fortune");

exports.home = (req, res) =>
  res.render("home", { fortune: getRandomFortune() });

exports.about = (req, res) =>
  res.render("about", { fortune: getRandomFortune() });

exports.notFound = (req, res) => {
  res.status(404);
  res.render("404");
};

exports.serverError = (err, req, res) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
};
