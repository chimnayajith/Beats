const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear-queue")
    .setDescription("Clear all songs in the queue"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/clear-queue",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute:⠀ | ⠀No music currently playing**`);

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const oneSong = new EmbedBuilder().setColor("#2f3136").setDescription(`**❌ ⠀|⠀ Only one song in the queue**`);
    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [oneSong], ephemeral: true });

    await queue.tracks.clear();

    const clearSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`**🗑️ ⠀|⠀ Queue cleared**`);
    interaction.reply({ embeds: [clearSuccess] });
  },
};
