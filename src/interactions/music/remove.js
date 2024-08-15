const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

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
      return interaction.reply({ embeds: [embed1] , ephemeral : true});

    if (position < 1 || position > queue.tracks.size)
      return interaction.reply({ embeds: [embed3] , ephemeral : true});

    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [embed2] , ephemeral : true});
    let song = queue.tracks.toArray()[position - 1];
    queue.tracks.removeOne((t) => t.id === song.id , true)

    const embed4 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:wastebasket: ⠀|⠀ **${song.title}** removed from queue`);

      await logIfRequired(interaction.guild.id ,interaction.guild.ownerId, "controlLogs" , {
        guildName: interaction.guild.name,
        guildID: interaction.guild.id,
        guildIcon: interaction.guild.iconURL(),
        command : "remove",
        userID : interaction.user.id ,
        textChannel : interaction.channel.id
      });

    interaction.reply({ embeds: [embed4] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
  },
};
