const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle songs in the queue"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/shuffle",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);
    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const noSongs = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ Only one song in the queue**`);
    const shuffleSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:shuffle:903278425702269040> ⠀|⠀ Queue shuffled : ${queue.tracks.size} songs**`);

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [noSongs], ephemeral: true });

    await queue.tracks.shuffle();

    return interaction.reply({ embeds: [shuffleSuccess] });
  },
};
