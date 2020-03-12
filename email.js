require("dotenv").config();
const mailgun = require("mailgun-js");
const domain = process.env.DOMAIN;
const apiKey = process.env.API_KEY;
const mg = mailgun({ apiKey, domain, host: "api.eu.mailgun.net" });
const defaultData = {
  from: "Marta Pere <do-not-reply@hola.martapere.com>",
  to: "",
  subject: "",
  html: ""
};

const defaultCallback = (error, body) => {
  if (error) {
    console.error(error);
  } else {
    console.log(body);
  }
};
exports.sendMail = (data, callback) =>
  mg.messages().send({ ...defaultData, ...data }, callback || defaultData);
