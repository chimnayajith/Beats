const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Bot invite and Support Server invite"),
  category: "Infos",
  utilisation: "/invite",

  async execute(client, interaction) {
    const exampleEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Invite Bot")
      .setDescription(
        "Add Beats to any server or join the support server for ...well support!"
      )
      .setThumbnail(
        "https://cdn.beatsbot.in/Beats.png"
      );

    const invite = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setURL("https://discord.com/api/oauth2/authorize?client_id=886801342239211522&permissions=274914986304&scope=bot%20applications.commands")
          .setLabel("Invite Bot")
          .setEmoji(`<:add:901666352614473728>`)
          .setStyle(5)
      )
      .addComponents(
        new ButtonBuilder()
          .setURL("https://discord.gg/JRRZmdFGmq")
          .setLabel("Support Server")
          .setEmoji(`<:discord:901666981944655912>`)
          .setStyle(5)
      );
    interaction.reply({ embeds: [exampleEmbed], components: [invite] });
  },
};
