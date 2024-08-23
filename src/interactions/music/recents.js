const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recently-played")
    .setDescription("Link to your recently played tracks."),

  voiceChannel: false,
  vote: false,
  category: "Music",
  utilisation: "/recently-played",

  async execute(client, interaction) {
    const recents = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        "You can find your recently played songs in the Beats Dashboard. Use this Link : https://dashboard.beatsbot.in/recentplayed",
      )
      .setTitle("Recently Played Songs (2 weeks)")
      .setImage("https://cdn.beatsbot.in/Beats.png");
    interaction.reply({ embeds: [recents] });
  },
};
