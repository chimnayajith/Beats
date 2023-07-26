const { Player } = require("discord-player");
const { Client, GatewayIntentBits, Partials  , Options , WebhookClient , EmbedBuilder} = require("discord.js");
process.env.FFMPEG_PATH = require('ffmpeg-static')

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel , Partials.GuildMember],
  disableMentions: "everyone",
});
module.exports.bot = client;

// client.rest.on('rateLimited', async (data) => {
//   const embed = new EmbedBuilder().setColor('#2f3136').setTitle('Ratelimited')
//   .addFields([
//       {name: 'Timeout Duration', value: data.timeToReset.toString(), inline: true},
//       {name: 'Max Limit', value: data.limit.toString(), inline: true},
//       {name: 'Method', value: data.method, inline: true},
//       {name: 'Path', value: data.majorParameter, inline: true},
//       {name: 'Route', value: data.route, inline: true},
//       {name: 'Global?', value: data.global, inline: true}
//   ]).setTimestamp();

//     const webhookClient = new WebhookClient({url : "https://discord.com/api/webhooks/1121858697812000838/63nYVPjOrhBM3xGh50peX_PRSKg18iuSX1982CBLIHYCXNBceM01tPfr1aluom4EyZOm"});
//     webhookClient.send({content : "<@&889559572510023791>" , embeds : [embed]});
// });

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
client.login("OTA1MTQ4MTI5MjE1NjY4MjU0.GiZ9QU.XBJ5mNZl8kVKW_0ADzjxf8J1P70ksFrmMqZDBo");