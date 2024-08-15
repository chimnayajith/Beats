const mongoose = require("mongoose");
const {beats_bot} = require("../common/startup/connectDB");


const patronSchema = mongoose.Schema(
    {
      _id: {
        type: String,
      },
      donator: {
        type: Array,
      },
      user_plus: {
        type: Array,
      },
      server_plus: {
        type: Array,
      },
    }
  );

  module.exports = beats_bot.model("patrons", patronSchema);