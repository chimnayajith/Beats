const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');
const beats_bot = require('../mongodb/beats-bot');

const serverPlaylist = mongoose.Schema({
    _id: { type: ObjectId,auto:true},
    guildID: { type:String, required:true},
    enable: { type : Boolean , required : true , default : true },
    roleID: { type:String, required:true},   
    playlistName : { type:String, required:true },
    image : { type:String , default:"https://cdn.beatsbot.in/attachments/playlists.png"},
    playlistTracks : { type:Array,required:true},
    tracks: { type:Number,required:true},
},{
    timestamps : true
});

module.exports =  beats_bot.model("serverPlaylists", serverPlaylist); 