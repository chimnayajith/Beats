const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder , ActionRowBuilder , ButtonBuilder} = require("discord.js");
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
    
    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const track = queue.currentTrack;
    const methods = ["Disabled", "Track", "Queue" , "AutoPlay"];

    const embed2 = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`${track.title}`)
      .setURL(track.url)
      .addFields(
        { name: "Channel", value: `\`${track.author}\``, inline: true },
        {
          name: "Views",
          value: `\`${abbreviateNumber(track.views, 2, {
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
        { name: "Volume", value: `\`${queue.node.volume}%\``, inline: true }
      )
      .setThumbnail(track.thumbnail)
      .setDescription(
        `⠀\n${queue.node.createProgressBar({
          indicator: "<:greendot:889018164694904872>",
          timecodes: true,
        })}⠀\n⠀\n`
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel(" ")
        .setStyle(2)
        .setEmoji("🔀"),

      new ButtonBuilder()
        .setCustomId("back")
        .setLabel(" ")
        .setStyle(2)
        .setEmoji("⏮"),
      new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("<:pause:1105337419710091316>  ")
        .setStyle(2)
        .setEmoji("⏸"),

      new ButtonBuilder()
        .setCustomId("next")
        .setLabel(" ")
        .setStyle(2)
        .setEmoji("⏭"),

      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel(" ")
        .setStyle(4)
        .setEmoji("⏹")
    );

    interaction.reply({ embeds: [embed2] , components: [row]});
  },
};
