const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');
const beats_bot = require('../mongodb/beats-bot');

const recentSongs = mongoose.Schema({
    _id: { type: ObjectId , auto:true },
    userID:{ type:String , required:true },
    guildID : { type : String , required : true },
    track :{ type:Object , required:true },
},
{
    timestamps: true
});

module.exports = beats_bot.model("recentSongs", recentSongs);