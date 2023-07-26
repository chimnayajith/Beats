const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder , PermissionFlagsBits} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue) => {
    const disconnect1 = new EmbedBuilder().setColor("#2f3136").setDescription("<a:tick:889018326255288360>⠀ | ⠀Beats has been \`disconnected\`.");
    if(interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel , PermissionFlagsBits.EmbedLinks])) {
        queue.metadata.interaction.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
    }
};