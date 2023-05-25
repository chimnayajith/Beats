const mongoose = require("mongoose");

const beats_web = mongoose.createConnection(
  "mongodb+srv://Beats:chinmayajith2003@beats.axuud.mongodb.net/beats-web?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = beats_web;