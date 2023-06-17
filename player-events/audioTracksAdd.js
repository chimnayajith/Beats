const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");

//Event for tracks/playlists being added to queue
module.exports = async (queue , tracks ) => {
    if (queue.metadata.playlist) return;
  const tracksAdd = new EmbedBuilder()
    .setColor("#2f3136")
    .setAuthor({ name: "Playlist Added to Queue" })
    .setTitle(`${tracks[0].playlist?.title || `\`N/A\``}`)
    .setThumbnail(tracks[0].playlist?.thumbnail || 'https://cdn.beatsbot.in/attachments/playlists.png')
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
};