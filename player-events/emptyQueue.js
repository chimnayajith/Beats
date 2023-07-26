const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder,PermissionFlagsBits} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue) => {

    const exhaust = new EmbedBuilder()
  .setColor("#2f3136")
  .setTitle(":shower: ⠀ | ⠀Queue Exhausted")
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
  queue.delete();
  if(queue.metadata.interaction.guild.members.me.permissionsIn(queue.metadata.interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel , PermissionFlagsBits.EmbedLinks])
) {
    queue.metadata.interaction.channel.send({embeds: [exhaust],components: [vote_patreon]})
      .then((message) => setTimeout(() => message.delete().catch(console.error), 30000));
  }
};