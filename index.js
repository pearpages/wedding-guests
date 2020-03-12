const packageJson = require("./package.json");
const VERSION = packageJson.version;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connection = process.env.MONGODB_URI;
const { sendMail } = require("./email");

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const Contact = mongoose.model("Contact", {
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: { type: String },
  message: { type: String, required: true }
});

const RSVP = mongoose.model("RSVP", {
  name: { type: String, required: true },
  partner: { type: String, required: true },
  partnerName: { type: String },
  comments: { type: String },
  food: { type: String }
});

const app = express();
app.use(express.json());
const whiteList = [
  "http://127.0.0.1",
  "https://127.0.0.1",
  "http://localhost",
  "https://localhost",
  "https://stage.martapere.com",
  "https://martapere.com"
];
const corsOptions = {
  origin: function(origin, callback) {
    if (
      !origin ||
      whiteList.some(whitelisted => origin.startsWith(whitelisted))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.type("text/plain");
  res.send("Wedding backend is up. Version: " + VERSION);
});

app.post("/contact", async (req, res) => {
  res.type("application/json");
  const data = new Contact(req.body);
  try {
    const response = await data.save();
    res.send(response);
    await sendMail({
      to: data.email,
      subject: "Gracias por tu mensaje",
      html: `<p>Gracias por tu mensaje:</p> <pre>${data.message}</pre>`
    });
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

app.post("/rsvp", async (req, res) => {
  res.type("application/json");
  const data = new RSVP(req.body);
  try {
    const response = await data.save();
    res.send(response);
    await sendMail({
      from: "RSVP casament <do-not-reply@hola.martapere.com>",
      to: "pere@soms.cat, marta@yahoo.es",
      subject: "RSVP del Casament",
      html: `<pre>${data}</pre>`
    });
  } catch (e) {
    res.status(400);
    res.send(e);
  }
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
  res.send(err.message);
});

app.listen(port, () =>
  console.log(`Express started on ${port}; ` + `press Ctrl-C to terminate.`)
);
