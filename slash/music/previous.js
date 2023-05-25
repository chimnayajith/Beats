const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Move to the previous song in the queue"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/previous",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    if (!queue || !queue.node.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const noPrevious = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x: ⠀| ⠀No tracks were played before.**`);
    if (!queue.history.tracks.at(0)) return interaction.reply({ embeds: [noPrevious], ephemeral: true });

    interaction.deferReply()
    await queue.history.previous(true);

    const prevSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360>⠀ |⠀ Playing **previous** track.`);
    interaction.editReply({ embeds: [prevSuccess] });
  },
};
