const io = require('socket.io-client');
const { EmbedBuilder } = require("discord.js");

const socket = io('https://api.beatsbot.in/');


socket.on('connect', () => {
  console.log(`Connected to Socket.IO server ${socket.id}`);
});


  // spotify confirmation
if (client.shard.ids.includes(0)){
      socket.on("spotify-confirmation", (data ) => {
        const embed = new EmbedBuilder()
          .setColor("#2f3136")
          .setDescription(`Your spotify account has been authorized. The account linked to <:beats:1115516004886388736> Beats is : **[${data.spotifyUserId}](https://open.spotify.com/user/${data.spotifyUserId})**.\n\nUse the command </spotify play:1125445351562809364> to access your playlists and add them to the queue effortlessly.`)
          .setTitle('<:spotify:1123967292900900965> Spotify Account Authorized')
          .setThumbnail(data.spotifyAvatar);
        client.users.fetch(data.discordId).then((user) => {
          if (data.success) return user.send({embeds : [embed]})
        })
      })
}

