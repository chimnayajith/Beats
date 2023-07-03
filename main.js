const { Player } = require("discord-player");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
process.env.FFMPEG_PATH = require('ffmpeg-static')

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel],
  disableMentions: "everyone",
});
module.exports.bot = client;

client.config = require("./config");

global.player = new Player(client);
async function loadData() {
  try {
    await player.extractors.loadDefault();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

loadData();

require("./src/loader");
require("./src/slashloader");
require("./src/guildslash");
require("./src/voteReminder");


require("./mongodb/beats-bot")
require("./mongodb/beats-web")


//Socket.io connection
require("./src/socket-io")   

//Error Handling
// process.on("unhandledRejection", (reason, p) => {
//   console.log(" [antiCrash] :: Unhandled Rejection/Catch");
//   console.log(reason, p);
// });
// process.on("uncaughtException", (err, origin) => {
//   console.log(" [antiCrash] :: Uncaught Exception/Catch");
//   console.log(err, origin);
// });
// process.on("uncaughtExceptionMonitor", (err, origin) => {
//   console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
//   console.log(err, origin);
// });
// process.on("multipleResolves", (type, promise, reason) => {
//   console.log(" [antiCrash] :: Multiple Resolves");
//   console.log(type, promise, reason);
// });

client.login("OTA1MTQ4MTI5MjE1NjY4MjU0.GiZ9QU.XBJ5mNZl8kVKW_0ADzjxf8J1P70ksFrmMqZDBo");
