const mongoose = require("mongoose");

const beats_bot = mongoose.createConnection(
  "mongodb+srv://Beats:chinmayajith2003@beats.axuud.mongodb.net/Data?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = beats_bot;