const io = require('socket.io-client');
const { EmbedBuilder } = require("discord.js");

const socket = io('https://api.beatsbot.in/');
// const socket = io('https://beats-beta.vercel.app/');


socket.on('connect', () => {
  console.log(`Connected to Socket.IO server ${socket.id}`);
});

// socket.on("stats", () => {
    // console.log('sending stats to website')
    // socket.emit('stats' , {serverCount : client.guilds.cache.size, userCount: client.guilds.cache.forEach((guild) => {totalMembers += guild.memberCount})})
// });

socket.on("statsres", (data ) => {
    console.log("Received data:", data );
  });


// Resume music
socket.on("/resume", (data ) => {
    const queue = player.nodes.get(data.guildId);
    if(queue) {
        if (queue.node.isPaused()) {
            const resumeSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<:resume:1105337417453547630>⠀|⠀${queue.currentTrack.title} \`resumed\` from web player!.`);
            queue.node.resume();
            queue.metadata.interaction.channel.send({embeds : [ resumeSuccess ]}).then((message) => setTimeout(() => message.delete(), 20000));
        } else {

            const pauseSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<:pause:1105337419710091316>⠀|⠀${queue.currentTrack.title} \`paused\` from web player.`);

            queue.node.pause();
            queue.metadata.interaction.channel.send({embeds : [pauseSuccess]}).then((message) => setTimeout(() => message.delete(), 20000));
        }
    }
  });


// Skip to next song
socket.on("/skip", (data ) => {
    const queue = player.nodes.get(data.guildId);
    if ( queue ) {
        const skipped = new EmbedBuilder().setColor("#2f3136").setDescription(`**<:right:905743975607046145> ⠀|⠀ Current song skipped from web player!**`);
        queue.node.skip();
        queue.metadata.interaction.channel.send({embeds : [skipped]}).then((message) => setTimeout(() => message.delete(), 20000));
    }
  });

// previous song 
socket.on("/previous", (data ) => {
    const queue = player.nodes.get(data.guildId);
    if ( queue ) {
        if (!queue.history.tracks.at(0)) return;

        const prevSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360>⠀ |⠀ Playing **previous** track.`);
        queue.history.previous();
        queue.metadata.interaction.channel.send({embeds : [prevSuccess]}).then((message) => setTimeout(() => message.delete(), 20000));
    }
  })
  
// showing guilds on dashboard

// socket.on("getGuilds", (data) => {
//   const manageable = []; //beats inte guilds

//   data.guilds.forEach(async guild => {
//     (client.guilds.cache.has(guild.id)) ? manageable.push({ ...guild, beats: true }) : manageable.push({ ...guild, beats: false })
//   })
//   socket.emit("guildsResponse", { user : data.user , guilds: manageable });
// })


socket.on("getGuilds", (data) => {
  const manageable = []; // bot added

  async function processGuilds() {
    for (const guild of data.guilds) {
      const result = await client.shard.broadcastEval((c, id) => c.guilds.cache.has(id), { context: guild.id });
      const hasBot = result.some((each) => each === true);
      manageable.push({ ...guild, bot: hasBot });
    }
  }
  
  processGuilds()
    .then(() => {
      const sanam = { user : data.user , guilds: manageable }
      console.log(sanam)
      socket.emit("guildsResponse", { user : data.user , guilds: manageable });
    })
    .catch((error) => {
      console.log(error)
    });
})
  // spotify confirmation
  // socket.on("spotify-confirmation", (data ) => {
  //    console.log(data)
  //   const embed = new EmbedBuilder()
  //     .setColor("#2f3136")
  //     .setDescription(`Your spotify account has been authorized. The account linked to <:beats:1115516004886388736> Beats is : **[data.spotifyUserId](data.spotifyUrl)**.\n\nUse the command </spotify play:1123951862236852304> to access your playlists and add them to the queue effortlessly.`)
  //     .setTitle('<:spotify:1123967292900900965> Spotify Account Authorized')
  //     .setThumbnail(data.spotifyAvatar);
  //   client.users.fetch(data.discordId).then((user) => {
  //     if (data.success) return user.send({embeds : [embed]})
  //   })
  // })



//   stats emit
// client.shard.broadcastEval(async (c) => {
//     const promises = [
//       c.shard.fetchClientValues("guilds.cache.size"),
//       c.shard.broadcastEval((c) =>
//         c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
//       ),
//     ];
  
//     return Promise.all(promises).then((results) => {  
//       const totalGuilds = results[0].reduce(
//         (acc, guildCount) => acc + guildCount,
//         0
//       );
//       const totalMembers = results[1].reduce(
//         (acc, memberCount) => acc + memberCount,
//         0
//       );

//       const servercount = c.channels.cache.get("889694415310962739");
//       servercount?.setName(`Server Count: ${totalGuilds}`);
//       const usercount = c.channels.cache.get("889695060965355550");
//       usercount?.setName(`Users : ${totalMembers}`);

//       const data = [totalGuilds, totalMembers];
//       return data;
//     });
//   }).then((data) => {
//     console.log(data[0])
//     socket.emit('stats' , data[0])
//     message.reply('emitted')
//   })