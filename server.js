const app = require("./app");
const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://Kateryna:Ong7aa8CNmMHZupw@cluster0.pores0v.mongodb.net/contacts_name?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
