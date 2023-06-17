const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue , track) => {
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
};