const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Move to the previous song in the queue"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/previous",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    if (!queue || !queue.isPlaying())
      return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const noPrevious = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:x: ⠀| ⠀No tracks were played before.**`);
    if (!queue.history.tracks.at(0))
      return interaction.reply({ embeds: [noPrevious], ephemeral: true });

    interaction.deferReply();
    await queue.history.previous(true);

    await logIfRequired(
      interaction.guild.id,
      interaction.guild.ownerId,
      "controlLogs",
      {
        guildName: interaction.guild.name,
        guildID: interaction.guild.id,
        guildIcon: interaction.guild.iconURL(),
        command: "previous",
        userID: interaction.user.id,
        textChannel: interaction.channel.id,
      },
    );

    const prevSuccess = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:tick:889018326255288360>⠀ |⠀ Playing **previous** track.`,
      );
    interaction
      .editReply({ embeds: [prevSuccess] })
      .then((message) =>
        setTimeout(() => message.delete().catch(console.error), 20000),
      );
  },
};
