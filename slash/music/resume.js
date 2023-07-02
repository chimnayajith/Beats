const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the player"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/resume",
  async execute(client, interaction) {

    const queue = player.nodes.get(interaction.guild.id);


    const noTracks = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute: ⠀|⠀ No music currently playing**`);

    if (!queue) return interaction.reply({ embeds: [noTracks], ephemeral: true });

    const alreadyPlaying = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:notes: ⠀|⠀ Music already playing`);

    const resumeSuccess = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<:resume:1105337417453547630>⠀|⠀${queue.currentTrack.title} \`resumed\`.`
      );

    const errorEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:x:⠀|⠀Something went wrong.Try Again`);
    try {

      if (queue.node.isPaused()) {
        queue.node.resume();
        interaction.reply({ embeds: [resumeSuccess] }).then((message) => setTimeout(() => message.delete(), 20000));
      } else {
        interaction.reply({ embeds: [alreadyPlaying], ephemeral: true });
      }
    } catch (err) {
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
