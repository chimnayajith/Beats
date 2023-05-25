const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the music "),
  voiceChannel: true,
  category: "Music",
  utilisation: "/pause",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noTracks = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute: ⠀|⠀ No music currently playing**`);

    if (!queue) return interaction.reply({ embeds: [noTracks], ephemeral: true });

    const alreadyPaused = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:x: ⠀|⠀Music already paused`);

    const pauseSuccess = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<:pause:1105337419710091316>⠀|⠀${queue.currentTrack.title} \`paused\`.`
      );
    const errorEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:x: ⠀|⠀Something's wrong.Try Again`);

    try {
      if (queue.node.isPaused()) {
        interaction.reply({ embeds: [alreadyPaused], ephemeral: true });
      } else {
        queue.node.pause();;
        interaction.reply({ embeds: [pauseSuccess] });
      }
    } catch {
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
