const mongoose = require("mongoose");

const Machine = new mongoose.Schema({
  macA: String,
  cpuLoad: Number,
  freeMem: Number,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  uptime: Number,
  type: String,
  numOfCores: Number,
  speed: Number,
});

module.exports = mongoose.model("Machine", Machine);
