const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

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
player.events.on("playerStart", (queue, track) => {
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
  if (queue.repeatMode === 1) {
    queue.metadata.interaction.channel.send({ embeds: [embed1] }) ||
      queue.connection.channel
        .send({ embeds: [embed1] })
        .then((message) => setTimeout(() => message.delete(), 20000));
  } else {
    queue.metadata.interaction.channel.send({ embeds: [embed1] }) ||
      queue.connection.channel.send({ embeds: [embed1] });
  }
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

  if (queue.node.isPlaying()) {
    queue.metadata.interaction.channel.send({ embeds: [trackAdd] }) ||
      queue.connection.channel.send({ embeds: [trackAdd] });
  }
});


//Event for tracks/playlists being added to queue
player.events.on("audioTracksAdd", (queue, tracks) => {
  if (queue.metadata.playlist) return;
  const tracksAdd = new EmbedBuilder()
    .setColor("#FFFFFF")
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
  queue.metadata.interaction.channel.send({ embeds: [tracksAdd] }) ||
    queue.connection.channel.send({ embeds: [tracksAdd] });
});

//Bot disconnected from voice channel
const disconnect1 = new EmbedBuilder()
  .setColor("Random")
  .setDescription(":x: ⠀ | ⠀ Beats has been disconnected");
player.events.on("disconnect", (queue) => {
  queue.node.pause();;
  queue.delete();
  queue.metadata.interaction.channel.send({ embeds: [disconnect1] }) ||
    queue.connection.channel.send({ embeds: [disconnect1] });
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
  }) ||
    queue.connection.channel.send({
      embeds: [empty],
      components: [vote_patreon],
    });
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
  }) ||
    queue.connection.channel.send({
      embeds: [exhaust],
      components: [vote_patreon],
    });
});
