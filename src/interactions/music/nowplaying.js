const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Current song info"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/nowplaying",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    if (!queue || !queue.isPlaying())
      return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const track = queue.currentTrack;
    const methods = ["Disabled", "Track", "Queue", "AutoPlay"];

    const embed2 = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`${track.title}`)
      .setURL(track.url)
      .addFields(
        { name: "Channel", value: `\`${track.author}\``, inline: true },
        {
          name: "Views",
          // value: `\`${abbreviateNumber((track.views === 0) ? track.metadata.bridge.views || 0 : track.views , 2, {
          value: `\`${abbreviateNumber(track.views, {
            symbols: ["", " K", " M", " B"],
          })}\``,
          inline: true,
        },
        { name: "Duration", value: `\`${track.duration}\``, inline: true },
        {
          name: "Requested by",
          value: `<@${track.requestedBy?.id}>`,
          inline: true,
        },
        {
          name: "Loop Mode",
          value: `\`${methods[queue.repeatMode]}\``,
          inline: true,
        },
        { name: "Volume", value: `\`${queue.node.volume}%\``, inline: true },
      )
      .setThumbnail(track.thumbnail)
      .setDescription(
        `⠀\n${queue.node.createProgressBar({
          indicator: "<:greendot:889018164694904872>",
          leftChar: "<:played:1125310974585475122>",
          rightChar: "<:unplayed:1125310972119220295>",
          timecodes: true,
        })}⠀\n⠀\n`,
      );

    interaction.reply({ embeds: [embed2] });
  },
};
