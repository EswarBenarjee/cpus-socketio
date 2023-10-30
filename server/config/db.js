const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://eswar:gdYN6TFvXVenMvvm@cluster0.tr2cllj.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("err:", err));
