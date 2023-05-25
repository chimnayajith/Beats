const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { DiscordTogether } = require("discord-together");

client.discordTogether = new DiscordTogether(client);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube-together")
    .setDescription("Watch Youtube along with your friends"),
  voiceChannel: true,
  category: "Staff",
  utilisation: "/youtube-together",

  async execute(client, interaction) {
    const youtube = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Youtube Together")
      .setDescription(
        "Watch Youtube together with your friends. Start the Activity by clicking the button below! "
      )
      .setThumbnail("https://cdn.beatsbot.in/Beats_main.png");

    client.discordTogether
      .createTogetherCode(interaction.member.voice.channel.id, "youtube")
      .then(async (invite) => {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(`${invite.code}`)
            .setStyle(5)
            .setLabel("Start ")
        );
        return interaction.reply({ embeds: [youtube], components: [row] });
      });
  },
};
