const mongoose = require('mongoose');
const {beats_bot} = require("../common/startup/connectDB");

const analyticsSchema = new mongoose.Schema({
serverCount: { type: Number, required: true },
userCount: { type: Number, required: true },
timestamp: { type: Date, default: Date.now },
});

module.exports = beats_bot.model('Analytics', analyticsSchema);