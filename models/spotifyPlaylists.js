const mongoose = require("mongoose");
const beats_bot = require('../mongodb/beats-bot');

const spotify = mongoose.Schema(
  {
    _id: { type: String, required: true },
    spotifyPlaylists: { type: String },
    access_token : { type: String},
    refresh_token : { type: String},
    expires : { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = beats_bot.model("spotify-playlists", spotify);