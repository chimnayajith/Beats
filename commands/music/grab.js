const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("grab")
    .setDescription("Save song to DM's"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/grab",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute:⠀ | ⠀No music currently playing**`);
    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const track = queue.currentTrack;

    const songInfo = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(track.title)
      .setAuthor({ name: "Song Saved" })
      .setURL(track.url)
      .addFields(
        {
          name: `:musical_note: Channel`,
          value: `\`${track.author}\``,
          inline: true,
        },
        {
          name: "<:yt:889018080297119766> Views",
          value: `\`${track.views}\``,
          inline: true,
        },
        {
          name: ":hourglass: Duration",
          value: `\`${track.duration}\``,
          inline: true,
        }
      )
      .setThumbnail(track.thumbnail)
      .setFooter({ text: `Saved from ${interaction.guild.name}` });

    const songGrabbed = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mailbox_with_mail:⠀ | ⠀Song saved to DM**`);
    const dmClosed = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x:⠀ | ⠀Unable to DM ${interaction.user}**`);

    interaction.user
      .send({ embeds: [songInfo] })
      .then(() => {
        interaction.reply({ embeds: [songGrabbed] , ephemeral:true});
      })
      .catch((error) => {
        interaction.reply({ embeds: [dmClosed], ephemeral: true });
      });
  },
};
