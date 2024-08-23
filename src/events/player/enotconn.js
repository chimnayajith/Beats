const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

//custom event for enotconn
module.exports = async (queue) => {
  const enotconn = new EmbedBuilder()
    .setColor("#2f3136")
    .setDescription(
      "Due to an error in the queue, it has been deleted.This is to prevent the bot from crashing.",
    );
  if (
    queue.metadata.interaction.guild.members.me
      .permissionsIn(queue.metadata.interaction.channel)
      .has([
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.EmbedLinks,
      ])
  ) {
    await queue.metadata.interaction.channel.send({ embeds: [enotconn] });
  }
  queue.setRepeatMode(0);
  queue.delete();
};
