const mongoose = require("mongoose");
const { beats_bot } = require("../common/startup/connectDB");

const guildSettings = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  guildID: {
    type: String,
    required: true,
  },
  logs: {
    type: Object,
  },
  dj: {
    type: Object,
  },
  updatedTime: {
    type: String,
    default: Date.now(),
  },
});

module.exports = beats_bot.model("guildSettings", guildSettings);
