const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');
const beats_bot = require('../mongodb/beats-bot');

const notifications = mongoose.Schema({
    _id: { type: String  },
   notification : { type : Array  },
   read : { type : Array},  
});

module.exports =  beats_bot.model("notifications", notifications);