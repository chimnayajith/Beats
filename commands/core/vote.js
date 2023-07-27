const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for Beats on sites"),
  category: "Infos",
  utilisation: "/vote",

  async execute(client, interaction) {
    const aboutEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Upvote Beats")
      .setThumbnail(
        "https://cdn.beatsbot.in/Beats.png"
      )
      .setDescription(
        "Show your support by helping Beats grow by upvoting in the following sites.\n"
      )
      .setFooter({ text: "Thank you and have a great day!" });

    const invite = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://discordbotlist.com/bots/beats-9741/upvote")
        .setLabel("dbl.com")
        .setEmoji("<:dbl:906810567694647336>")
        .setStyle(5),      
      new ButtonBuilder()
        .setURL("https://top.gg/bot/886801342239211522/vote")
        .setLabel("top.gg")
        .setEmoji("<:topgg:904199572715343882>")
        .setStyle(5),
      new ButtonBuilder()
        .setURL("https://discords.com/bots/bot/886801342239211522/vote")
        .setLabel("Bots for Discord")
        .setEmoji("<:discords:906810883202756628>")
        .setStyle(5)
    );
    interaction.reply({ embeds: [aboutEmbed], components: [invite] });
  },
};
