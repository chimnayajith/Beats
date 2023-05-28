const mongoose = require("mongoose");

const beats_web = mongoose.createConnection(
  "mongodb+srv://Beats:chinmayajith2003@beats.axuud.mongodb.net/beats-web?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
beats_web.on('error', (error) => {
  console.error('Connection error for beats-web:', error);
});

beats_web.once('open', () => {
  console.log('Connected to the database : beats-web');
  // You can start using the connected database here
});

module.exports = beats_web;