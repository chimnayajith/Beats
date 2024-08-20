const mongoose = require('mongoose');
require('dotenv').config();

const beats_bot = mongoose.createConnection(
    process.env.DATABASE_BEATS_BOT_URI
);

beats_bot.on('error', (error) => {
    console.error('Connection error for Data:', error);
});

beats_bot.once('open', () => {
    console.log('Connected to the database : Data');
});

const beats_web = mongoose.createConnection(
    process.env.DATABASE_BEATS_WEB_URI
);

beats_web.on('error', (error) => {
    console.error('Connection error for beats-web:', error);
});

beats_web.once('open', () => {
    console.log('Connected to the database : beats-web');
});

module.exports = {beats_bot, beats_web};
