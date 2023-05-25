const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip currently playing song"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/skip ",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const no_music = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const no_next = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ No song to play next**`);
    const skipped = new EmbedBuilder().setColor("#2f3136").setDescription(`**<:right:905743975607046145> ⠀|⠀ Current song skipped!**`);
    const error = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x: ⠀|⠀ Something went wrong..Try Again**`);

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ embeds: [no_music], ephemeral: true });

    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [no_next], ephemeral: true });

    const success = queue.node.skip();  

    return interaction.reply(
      success ? { embeds: [skipped] } : { embeds: [error], ephemeral: true }
    );
  },
};
