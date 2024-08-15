const mongoose = require("mongoose");
const {beats_bot} = require("../common/startup/connectDB");


const voteSchema = mongoose.Schema(
    {
      _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
      },
      avatar: {
        type: String,
      },
      username: {
        type: String,
      },
      id: {
        type: String,
        required: true,
      },
      lifetimeVotes: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = beats_bot.model("Vote", voteSchema);