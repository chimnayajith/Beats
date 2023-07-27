const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const ms = require("ms");
const prettyms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Move to a tiemstamp in the track")
    .addStringOption((option) =>
      option
        .setName("timestamp")
        .setDescription("Timestamp to seek.Eg: `1m` , `30s` , `120s` etc.")
        .setRequired(true)
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/seek <timestamp>",

  async execute(client, interaction) {
    const query = interaction.options.get("timestamp").value;

    const queue = player.nodes.get(interaction.guild.id);
    track = queue.currentTrack;

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    if (!queue) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const noTime= new EmbedBuilder().setColor("#2f3136").setDescription(`**:bangbang:⠀ | ⠀Specify position to seek**\n\`\`\`fix\n Use "/seek 2s"  , "/seek 1m" etc\`\`\``);
    if (!query) return interaction.reply({ embeds: [noTime] });

    const timeToMS = ms(query);

    const couldntSeek = new EmbedBuilder().setColor("#2f3136").setTitle(":x: ⠀|⠀ Time could not be seeked!").setDescription(`\`\`\`yaml\nUse format /seek 2s or 1m\`\`\``);
    if (!timeToMS) return interaction.reply({ embeds: [couldntSeek], ephemeral: true });

    const invalidTime = new EmbedBuilder().setColor("#2f3136").setTitle(`<a:warn:889018313143894046>⠀ | ⠀Provide a valid time below total time.`).setDescription("```yaml\nUse format /seek 2s or 1m```");
    if (timeToMS >= track.durationMS) return interaction.reply({ embeds: [invalidTime], ephemeral: true });

    interaction.deferReply()
    await queue.node.seek(timeToMS);

    const seekSuccess = new EmbedBuilder().setColor("#2f3136").setTitle(`<a:tick:889018326255288360> ⠀|⠀ Time set to **${prettyms(timeToMS, {colonNotation: true})}**`)
      .setDescription(
        `${queue.node.createProgressBar({
          indicator: "<:greendot:889018164694904872>",
          leftChar : "<:played:1125462742120267776>",
          rightChar : "<:unplayed:1125462737569452112>",
          timecodes: true,
        })}`
      )
      .setThumbnail(track.thumbnail);

    interaction.editReply({ embeds: [seekSuccess] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
  },
};
