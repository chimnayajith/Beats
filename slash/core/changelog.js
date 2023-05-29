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
      .setTitle("Changelog - [v3.0.1] ")
      .setDescription(
        `\`\`\`diff\n+ AutoPlay command is now a separate command.\n\n+ UI changes on our website/n/n+ New Blog page : https://blog.beatsbot.in\n\n+ Vote on discordbotlist.com to access vote restricted commands.\n\n+ You can now bypass vote retricted commands for a month by becoming a patron.\n\n+ Stability fixes.\n\n- review page removed from dashboard.\n\n- removedupes command is not available due to a package error.\`\`\``
      );
    message.reply({
      embeds: [embed1],
      allowedMentions: { repliedUser: false },
    });
  },
};
