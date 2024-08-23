const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("Recent changes made to the bot"),
  category: "Infos",
  utilisation: "/changelog",

  execute(client, interaction) {
    const embed1 = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Changelog - [v3.6.0] ")
      .setDescription(
        `\`\`\`diff\n+ New Server Playlist feature.\n\n+ Skipping tracks on the final track now ends the session.\n\n+ \n\n+ Bug Fixes.\`\`\``,
      );
    interaction.reply({
      embeds: [embed1],
    });
  },
};
