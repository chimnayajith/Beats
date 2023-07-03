const mongoose = require('mongoose')
const beats_bot = require("../mongodb/beats-bot")

const voteReminder = new mongoose.Schema({
        _id: {type: mongoose.Types.ObjectId,auto: true},
        userId: { type: String},
        nextVote :{ type : Date}
      },
      {
        timestamps: true,
      });

module.exports = beats_bot.model("votereminders" , voteReminder);