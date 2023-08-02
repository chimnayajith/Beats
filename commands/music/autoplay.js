const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Queue up songs similar to the current track")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Choice")
        .addChoices(
          { name: "Enable", value: "on" },
          { name: "Disable", value: "off" },
        )
        .setRequired(true)
    ),
  voiceChannel: true,
  vote: true,
  category: "Music",
  utilisation: "/autoplay [Enable/Disable]",

  async execute(client, interaction) {
    const input = interaction.options.get("option").value;

    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const autoplayEnabled = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Autoplay **enabled**");
    const autoplayDisabled = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Autoplay **disabled**");
    const errorEmbed = new EmbedBuilder().setColor("#2f3136").setDescription("<a:warn:889018313143894046>⠀|⠀Something went wrong.Try again");

    if (!queue) return interaction.reply({ embeds: [noMusic] , ephemeral :true});

    await logIfRequired(interaction.guild.id , "controlLogs" , {
      guildName: interaction.guild.name,
      guildID: interaction.guild.id,
      guildIcon: interaction.guild.iconURL(),
      command : "autoplay",
      userID : interaction.user.id ,
      textChannel : interaction.channel.id
    });

    if (input === "on") {
        queue.setRepeatMode(3);
        interaction.reply({ embeds : [autoplayEnabled]});
    } else if ( input === 'off') {
        queue.setRepeatMode(0);
        interaction.reply({ embeds: [autoplayDisabled] });
    }
  },
};
