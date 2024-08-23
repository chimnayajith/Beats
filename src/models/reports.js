const mongoose = require("mongoose");
const { beats_bot } = require("../common/startup/connectDB");

const { ObjectId } = require("mongodb");

const reportSchema = mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    userID: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      default: "open",
      enum: ["open", "closed", "pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const model = beats_bot.model("reports", reportSchema);

module.exports = model;
