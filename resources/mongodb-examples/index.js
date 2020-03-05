const fs = require("fs");
const mongoose = require("mongoose");

const data = require("./data.json");
const connection = process.env.MONGODB_URI; // locally in .env: MONGODB_URI=mongodb://localhost:27017/forms

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Contact = mongoose.model("Contact", {
  name: String,
  email: String,
  phone: String,
  message: String
});

Contact.find()
  .exec()
  .then(async contacts => {
    if (!contacts) {
      const response = await Promise.all(
        data.map(async contact => {
          const model = new Contact(contact);
          const response = await model.save();
        })
      );
      console.log(response);
      fs.appendFileSync("log.txt", response);
      process.exit();
    } else {
      console.log(contacts);
      process.exit();
    }
  });
