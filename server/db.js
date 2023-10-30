const mongoose = require("mongoose");

require("dotenv").config();
console.log();
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("err:", err));
