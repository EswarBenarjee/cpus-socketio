const mongoose = require("mongoose");

const config = require("config");
const db = config.get(
  "mongodb+srv://eswar:gdYN6TFvXVenMvvm@cluster0.tr2cllj.mongodb.net/?retryWrites=true&w=majority"
);

mongoose
  .connect(db)
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("err:", err));
