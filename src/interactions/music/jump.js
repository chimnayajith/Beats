const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to particular position in the queue")
    .addIntegerOption((option) =>
      option
        .setName("track")
        .setDescription("Which position do you want to skip to?")
        .setRequired(true),
    ),
  voiceChannel: true,
  category: "Music",
  vote: true,
  utilisation: "/jump <position>",

  async execute(client, interaction) {
    const position = interaction.options.get("track").value;

    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute:⠀ | ⠀No music currently playing**`);
    if (!queue || !queue.isPlaying())
      return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const songs = queue.tracks.size;

    const invalidIndex = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:interrobang:⠀ | ⠀Enter a valid option**`);
    if (position < 1 || position > songs)
      return interaction.reply({ embeds: [invalidIndex], ephemeral: true });

    let song = queue.tracks.toArray()[position - 1];
    queue.node.jump(position - 1);

    await logIfRequired(
      interaction.guild.id,
      interaction.guild.ownerId,
      "controlLogs",
      {
        guildName: interaction.guild.name,
        guildID: interaction.guild.id,
        guildIcon: interaction.guild.iconURL(),
        command: "jump",
        userID: interaction.user.id,
        textChannel: interaction.channel.id,
      },
    );
    const jumpSuccess = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:tick:889018326255288360>⠀ | ⠀Jumped to position ${position}: **${song.title}**`,
      );
    interaction
      .reply({ embeds: [jumpSuccess] })
      .then((message) =>
        setTimeout(() => message.delete().catch(console.error), 20000),
      );
  },
};
