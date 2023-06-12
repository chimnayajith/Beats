const mongoose = require('mongoose');
const beats_bot = require('../mongodb/beats-bot');

const notificationsSchema = mongoose.Schema({
    _id: {
      type: mongoose.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    read_bot: {
      type: Array,
    },
    read_web: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
  );

  module.exports =  beats_bot.model("testnotifs", notificationsSchema);