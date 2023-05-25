const { EmbedBuilder} = require("discord.js");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  const hello = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Hey there :wave:")
    .setDescription(
      `Beats uses slash commands. My prefix for **${message.guild.name}** is \`/\`. \n\nUse \`/help\` for list of my commands`
    )
    .setThumbnail(
      `https://cdn.discordapp.com/attachments/890594305012535296/903499375630761994/Beats_Logo_2.png`
    );

  try {
    if (
      message.content.match(
        new RegExp(`^<@!?${client.user.id}>\\s*(prefix)?`, "i")
      ) &&
      !message.content.includes("@everyone") &&
      !message.content.includes("@here")
    ) {
      message.reply({
        embeds: [hello],
        allowedMentions: { repliedUser: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
};
