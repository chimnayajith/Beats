const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove particular song in the queue")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Which song do you want to remove?")
        .setRequired(true)
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/remove <position>",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const position = interaction.options.get("position").value;

    const embed1 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const embed2 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:x: ⠀|⠀ Only one song in the queue`);
    const embed3 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:bangbang: ⠀|⠀ Enter a valid track position`);

    if (!queue)
      return interaction.reply({ embeds: [embed1] });

    if (position < 1 || position > queue.tracks.size)
      return interaction.reply({ embeds: [embed3] });

    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [embed2] });
    let song = queue.tracks.toArray()[position - 1];
    queue.tracks.removeOne((t) => t.id === song.id , true)

    const embed4 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:wastebasket: ⠀|⠀ **${song.title}** removed from queue`);

    interaction.reply({ embeds: [embed4] });
  },
};
