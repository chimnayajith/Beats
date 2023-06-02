const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');
const beats_bot = require('../mongodb/beats-bot');

const liked = mongoose.Schema({
    _id: {type: ObjectId,auto:true},
    userID:{type:String, required:true},
    image :{type:String , default:"https://cdn.beatsbot.in/attachments/favourites.png"},
    liked :{type:Array,required:true},
    trackCount :{type:Number,required:true},
});

module.exports = beats_bot.model("likedSongs", liked);