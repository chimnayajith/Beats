const { Player } = require("discord-player");
const { Client, GatewayIntentBits, Partials  , Options , WebhookClient , EmbedBuilder} = require("discord.js");


global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    ThreadManager: 10,
    GuildMemberManager: {
        maxSize: 10,
        keepOverLimit: (member) => member.id === client.user.id
    }
  }),
sweepers: {
    ...Options.DefaultSweeperSettings,
    users: {
        interval: 3600,
        filter: () => (user) => user.id !== client.user.id
    }
},  
  partials: [Partials.Channel],
  disableMentions: "everyone",
});

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

global.player = new Player(client , {
  useLegacyFFmpeg: false,
  ytdlOptions: {
    quality: "highest",
    filter: "audioonly",
    highWaterMark: 1 << 25,
    dlChunkSize: 0,
    chunking : false,
    requestOptions: {
      headers: {
        cookie:client.config.var.yt_cookie ,
      },
    },    
  },
});


async function loadData() {
  try {
    await player.extractors.loadDefault();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

loadData();

require("./utils/register/registerEventListeners");
require("./utils/register/registerSlashCommands");
require("./utils/register/registerGuildCommands");
require("./utils/other/voteReminder");


require("./mongodb/beats-bot")
require("./mongodb/beats-web")




//Socket.io connection
require("./utils/other/socket-io")   

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