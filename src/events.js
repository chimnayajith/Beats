const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const {addSongs}  = require("../utils/likedUtil");

//Logging errors to console channel
player.events.on("error", (queue, error) => {
  console.log(`Error at ${queue.guild.id} | ${error.message}`);
  const message1 = `Error at **${queue.guild.name}\t|\t${error.message}**`;
  client.shard.broadcastEval(
    async (c, { m }) => {
      const channel = c.channels.cache.get("899704750554112021");
      channel?.send(m);
    },
    { context: { m: message1 } }
  );
});

//Logging errors to console channel
player.events.on("playerError", (queue, error) => {
  console.log(
    `Error emitted from the connection ${error.message}|${queue.guild.name}`
  );
  const message2 = `Connection Error at **${queue.guild.name}⠀|⠀${error.message}**`;
  client.shard.broadcastEval(
    async (c, { m }) => {
      const channel = c.channels.cache.get("899704750554112021");
      channel?.send(m);
    },
    { context: { m: message2 } }
  );
});

//Message on Track Start
player.events.on("playerStart", async (queue, track) => {
  const  [minutes, seconds] = track.duration.split(":").map(Number); 
  const totalDuration  = (minutes*60*1000) + (seconds *1000)
  const embed1 = new EmbedBuilder()
    .setTitle(`<a:diskspin:889018326578233384> Now Playing `)
    .setColor("#2f3136")
    .setDescription(`[${track.title}](${track.url})`) 
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "Duration", value: ` \`${track.duration}\` `, inline: true },
      {
        name: "Channel",
        value: `<#${queue.channel.id}>`,
        inline: true,
      },
      { name: "Requested By", value: `${track.requestedBy}`, inline: true }
    );

  const likeSuccess = new EmbedBuilder().setColor("#2f3136").setTitle(`${track.title} Liked`).setURL('https://dashboard.beatsbot.in/playlists/liked').setDescription("Track has been added to your liked songs. Use the command \`/liked\` to play your liked songs!").setThumbnail('https://cdn.beatsbot.in/attachments/favourites.png')
  const ytTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ Youtube tracks cannot be added to liked songs. We are really sorry for the inconvenience caused.`)
  const dupeTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ This track is already liked by you!`)
  const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("like")
        .setLabel("Add to Liked!")
        .setEmoji("<:fave:1054803532244598824>")
        .setStyle(2)
  );

  const newTrack = await queue.metadata.interaction.channel
    .send({
      embeds: [embed1] ,
      components: [row],
      fetchReply: true
    })  || queue.connection.channel
    .send({ 
      embeds: [embed1] ,
      components: [row],
      fetchReply: true
    })
        
  setTimeout(() => newTrack.delete(), totalDuration)
  
  const collector =newTrack.createMessageComponentCollector({
      time : totalDuration,
      componentType: 2,
    });

  collector.on("collect", async (collected) => {
    await collected.deferUpdate();
    const status = await addSongs(collected.user.id , track);//0-duplicate track; 1- song added to liked songs
    if(track.source === 'youtube') return collected.followUp({embeds : [ytTrack] , ephemeral : true});
    switch (status) {
      case 0 : 
        collected.followUp({ embeds : [dupeTrack] , ephemeral : true})
        break;
      case 1 :
        collected.followUp({ embeds : [likeSuccess] , ephemeral : true})
        break;
    }
  });
});

//Event for track being added to queue
player.events.on("audioTrackAdd", (queue, track) => {
  if (queue.metadata.playlist) return;
  const trackAdd = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle(`<:queue:1089749380552212490> Track Added to Queue`)
    .setDescription(`${track.title}`)
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "Duration", value: `\`${track.duration}\``, inline: true },
      { name: "Requested By", value: `${track.requestedBy}`, inline: true }
    );

  if (queue.isPlaying()) {
    queue.metadata.interaction.channel.send({ embeds: [trackAdd] }).then((message) => setTimeout(() => message.delete(), 20000)) ||
      queue.connection.channel.send({ embeds: [trackAdd] }).then((message) => setTimeout(() => message.delete(), 20000));
  }
});


//Event for tracks/playlists being added to queue
player.events.on("audioTracksAdd", (queue, tracks ) => {
  if (queue.metadata.playlist) return;
  const tracksAdd = new EmbedBuilder()
    .setColor("#2f3136")
    .setAuthor({ name: "Playlist Added to Queue" })
    .setTitle(`${tracks[0].playlist?.title || `\`N/A\``}`)
    .setThumbnail(tracks[0].playlist?.thumbnail.url || 'https://cdn.beatsbot.in/attachments/playlists.png')
    .addFields(
      {
        name: "Tracks",
        value: `\`${tracks[0].playlist?.tracks.length|| 'N/A'}\``,
        inline: true,
      },
      {
        name: "Source",
        value: `\`${tracks[0].playlist?.source || 'N/A'}\``,
        inline: true,
      }
    );
  queue.metadata.interaction.channel.send({ embeds: [tracksAdd] }).then((message) => setTimeout(() => message.delete(), 20000)) ||
    queue.connection.channel.send({ embeds: [tracksAdd] }).then((message) => setTimeout(() => message.delete(), 20000));
});

//Bot disconnected from voice channel
const disconnect1 = new EmbedBuilder()
  .setColor("Random")
  .setDescription(":x: ⠀ | ⠀ Beats has been disconnected");
player.events.on("disconnect", (queue) => {
  queue.node.pause();;
  queue.delete();
  queue.metadata.interaction.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete(), 20000)) ||
    queue.connection.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete(), 20000)) ;
});

//Empty voice channel
const empty = new EmbedBuilder()
  .setColor("Random")
  .setTitle(":thought_balloon: ⠀ | ⠀Leaving due to inactivity")
  .setDescription("Hope you had a good time listening.");
const vote_patreon = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setURL("https://beatsbot.in/vote")
      .setLabel("Upvote")
      .setEmoji(`<a:vote:956901647043416104>`)
      .setStyle(5)
  )
  .addComponents(
    new ButtonBuilder()
      .setURL("https://beatsbot.in/patreon")
      .setLabel("Patreon")
      .setEmoji(`<:patreon:956903191507763240>`)
      .setStyle(5)
  );
player.events.on("emptyChannel", (queue) => {
  queue.delete();
  queue.metadata.interaction.channel.send({
    embeds: [empty],
    components: [vote_patreon],
  }).then((message) => setTimeout(() => message.delete(), 30000)) ||
    queue.connection.channel.send({
      embeds: [empty],
      components: [vote_patreon],
    }).then((message) => setTimeout(() => message.delete(), 30000));
});


//Event for Queue End
const exhaust = new EmbedBuilder()
  .setColor("#2f3136")
  .setTitle(":shower: ⠀ | ⠀Queue Exhausted")
  .setDescription("Hope you had a good time listening.");

player.events.on("emptyQueue", (queue) => {
  queue.node.setPaused();
  queue.delete();
  queue.metadata.interaction.channel.send({
    embeds: [exhaust],
    components: [vote_patreon],
  }).then((message) => setTimeout(() => message.delete(), 30000)) ||
    queue.connection.channel.send({
      embeds: [exhaust],
      components: [vote_patreon],
    }).then((message) => setTimeout(() => message.delete(), 30000));
});