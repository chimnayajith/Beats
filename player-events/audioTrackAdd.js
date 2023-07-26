const { EmbedBuilder, ButtonBuilder, ActionRowBuilder ,PermissionFlagsBits, StringSelectMenuBuilder} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue , track) => {
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
    
    if(queue.metadata.interaction.guild.members.me.permissionsIn(queue.metadata.interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannels , PermissionFlagsBits.EmbedLinks])
) {
      queue.metadata.interaction.channel.send({ embeds: [trackAdd] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000)) 
    } 
  }
};

