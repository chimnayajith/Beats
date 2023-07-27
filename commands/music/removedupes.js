const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removedupes")
    .setDescription("Removes repeated songs in the queue"),
  voiceChannel: true,
  category: "Music",
  vote: true,
  utilisation: "/removedupes",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute:⠀ | ⠀No music currently playing**`);
    if (!queue) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const oneSong = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ Only one song in the queue**`);
    if (!queue.tracks.toArray()[0])
      return interaction.reply({ embeds: [oneSong], ephemeral: true });

    await interaction.deferReply();

    const waitEmbed = new EmbedBuilder().setColor("#2f3136").setDescription("<a:loading1:898038915536134144>⠀ | ⠀Removing duplicates. Please wait...");
    await interaction.editReply({embeds: [waitEmbed],ephemeral: true,fetchReply: true});

    const noDuplicates = new EmbedBuilder().setColor("#2f3136").setDescription(":x:⠀ | ⠀No duplicate songs to remove");

    const songs = [];
    let dups = 0;
    const tracks = queue.tracks.toArray();

    for (let i = 0; i <= tracks.length - 1; i++) {
      const track = tracks[i];
      if (songs.includes(track.url)) {
        queue.tracks.removeOne((t) => t.id === track.id , true)
        dups++;
      } else {
        songs.push(track.url, track);
      }
    }

    const removeSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360>⠀ | ⠀Removed **${dups}** duplicates from queue.`);
    if (dups !== 0) {
      await interaction.editReply({ embeds: [removeSuccess] ,fetchReply : true});
    } else {
      await interaction.editReply({ embeds: [noDuplicates] });
    }
  },
};
