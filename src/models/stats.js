const mongoose = require("mongoose");
const { beats_web } = require("../common/startup/connectDB");

const statsSchema = mongoose.Schema({
  _id: { type: String },
  serverCount: { type: Number },
  userCount: { type: Number },
  guild_ids: { type: Array },
});

const model = beats_web.model("stats", statsSchema);

module.exports = model;
