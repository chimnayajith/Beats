const mongoose = require('mongoose')
const {beats_bot} = require("../common/startup/connectDB");


const voteReminder = new mongoose.Schema({
        _id: {type: mongoose.Types.ObjectId,auto: true},
        userId: { type: String},
        nextVote :{ type : Date}
      },
      {
        timestamps: true,
      });

module.exports = beats_bot.model("votereminders" , voteReminder);