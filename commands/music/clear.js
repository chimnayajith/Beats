const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../utils/scripts/settingsUtil");

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

    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const oneSong = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ Only one song in the queue**`);
    if (!queue.tracks.toArray()[0]) return interaction.reply({ embeds: [oneSong], ephemeral: true });

    await queue.tracks.clear();

    await logIfRequired(interaction.guild.id , "controlLogs" , {
      guildName: interaction.guild.name,
      guildID: interaction.guild.id,
      guildIcon: interaction.guild.iconURL(),
      command : "clear-queue",
      userID : interaction.user.id ,
      textChannel : interaction.channel.id
    });

    const clearSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`**🗑️ ⠀|⠀ Queue cleared. </disconnect:957138913833668634> to clear the current track**`);
    interaction.reply({ embeds: [clearSuccess] }).then((message) => setTimeout(() => message.delete().catch(console.error), 3000));
  },
};
