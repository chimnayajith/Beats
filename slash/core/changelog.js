const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("Recent changes made to the bot"),
  category: "Infos",
  utilisation: "/changelog",

  execute(client, message) {
    const embed1 = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Changelog - [v3.2.0] ")
      .setDescription(
        `\`\`\`diff\n+ New Liked Command Added to play the songs you've liked.\n\n+ New Report command to report issues or to give suggestions.\n\n+ New Notification command to check latest changes.\n\n+ Bug Fixes.\`\`\``
      );
    message.reply({
      embeds: [embed1],
      allowedMentions: { repliedUser: false },
    });
  },
};
