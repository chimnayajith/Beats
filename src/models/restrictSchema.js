const mongoose = require("mongoose");
const { beats_bot } = require("../common/startup/connectDB");

const restrictSchema = new mongoose.Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  moderator: { type: String },
  reason: { type: String },
  expireAt: { type: Date, index: { expires: 0 } },
});

restrictSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = beats_bot.model("restrictSchema", restrictSchema);
