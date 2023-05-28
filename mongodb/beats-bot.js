const mongoose = require("mongoose");

const beats_bot = mongoose.createConnection(
  "mongodb+srv://Beats:chinmayajith2003@beats.axuud.mongodb.net/Data",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

beats_bot.on('error', (error) => {
  console.error('Connection error for Data:', error);
});

beats_bot.once('open', () => {
  console.log('Connected to the database : Data');
  // You can start using the connected database here
});

module.exports = beats_bot;