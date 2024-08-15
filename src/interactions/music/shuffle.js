const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

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
    const noSongs = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ Minimum 3 songs to be queued to shuffle!**`);
    const shuffleSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:shuffle:903278425702269040> ⠀|⠀ Queue shuffled : ${queue.tracks.size} songs**`);

    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    if (!(queue.tracks.toArray().length >= 3)) return interaction.reply({ embeds: [noSongs], ephemeral: true });

    await queue.tracks.shuffle();

    await logIfRequired(interaction.guild.id,interaction.guild.ownerId , "controlLogs" , {
      guildName: interaction.guild.name,
      guildID: interaction.guild.id,
      guildIcon: interaction.guild.iconURL(),
      command : "shuffle",
      userID : interaction.user.id ,
      textChannel : interaction.channel.id
    });

    return interaction.reply({ embeds: [shuffleSuccess] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
  },
};
