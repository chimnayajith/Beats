const mongoose = require('mongoose')
const beats_bot = require("../mongodb/beats-bot")

const voterSchema = new mongoose.Schema({
        _id: {type: mongoose.Types.ObjectId,auto: true},
        discord_id: { type: String},
      },
      {
        timestamps: true,
      });

module.exports = beats_bot.model("Plus" , voterSchema);