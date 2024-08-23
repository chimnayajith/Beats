const mongoose = require("mongoose");
const { beats_bot } = require("../common/startup/connectDB");

const commandSchema = new mongoose.Schema({
  _id: { type: String },
  usageCount: { type: Number, default: 0 },
});

module.exports = beats_bot.model("commandSchema", commandSchema);
