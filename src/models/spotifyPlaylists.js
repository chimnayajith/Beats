const mongoose = require("mongoose");
const {beats_bot} = require("../common/startup/connectDB");


const spotify = mongoose.Schema(
  {
    _id: { type: String, required: true },
    spotifyPlaylists: { type: String },
    userSpotify : { type : Object},
    spotifyPlaylistItems: { type: Array },
    access_token : { type: String},
    refresh_token : { type: String},
    expires : { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = beats_bot.model("spotify-playlists", spotify);