const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { beats_bot } = require("../common/startup/connectDB");

const playlist = mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    userID: { type: String, required: true },
    playlistName: { type: String, required: true },
    image: {
      type: String,
      default: "https://cdn.beatsbot.in/attachments/playlists.png",
    },
    playlist: { type: Array, required: true },
    tracks: { type: Number, required: true },
    Duration: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const playlists = beats_bot.model("playlists", playlist);

module.exports = playlists;
