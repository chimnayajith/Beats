const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder , PermissionsBitField} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue) => {
    const disconnect1 = new EmbedBuilder().setColor("#2f3136").setDescription("<a:tick:889018326255288360>⠀ | ⠀Beats has been \`disconnected\`.");
    if(queue.metadata.interaction.guild.members.me.permissionsIn(queue.metadata.interaction.channel).has([PermissionsBitField.Flags.SendMessages , PermissionsBitField.Flags.ViewChannel , PermissionsBitField.Flags.EmbedLinks])) {
        queue.metadata.interaction.channel.send({ embeds: [disconnect1] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
    }
};