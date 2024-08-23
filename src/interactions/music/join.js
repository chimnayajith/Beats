const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins your voice channel"),
  category: "Music",
  utilisation: "/join",

  async execute(client, interaction) {
    const noPermission = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`,
      );
    if (!interaction.member.voice.channel.joinable)
      return interaction.reply({ embeds: [noPermission] });

    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.channel.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
      leaveOnEmpty: true,
    });

    const joinembed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:tick:889018326255288360>⠀ | ⠀Joined voice channel <#${interaction.member.voice.channel.id}>`,
      );
    interaction
      .reply({ embeds: [joinembed] })
      .then((message) =>
        setTimeout(() => message.delete().catch(console.error), 20000),
      );
  },
};
