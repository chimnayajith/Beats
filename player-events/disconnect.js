const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue) => {
    const disconnect1 = new EmbedBuilder().setColor("#2f3136").setDescription(":x: ⠀ | ⠀ Beats has been disconnected");
      queue.node.pause();
      queue.delete();
      queue.metadata.interaction.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete(), 20000)) ||
        queue.connection.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete(), 20000)) ;
};