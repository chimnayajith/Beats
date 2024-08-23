const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { QueryType } = require("discord-player");
const { showNotif } = require("../../common/utils/scripts/notifUtil");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music using song name or url")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("🎶 What song or playlist would you like to listen to?")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/play <song name/url>",

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    if (focusedValue.length > 0) {
      const result = await player.search(focusedValue);
      if (!result.playlist) {
        await interaction.respond(
          result.tracks.slice(0, 6).map((track) => ({
            name: `${track.title.length > 40 ? track.title.substring(0, 40) + "..." : track.title} by ${track.author.length > 40 ? track.author.substring(0, 40) + "..." : track.author}`,
            value: track.url,
          })),
        );
      } else {
        await interaction.respond(
          result.tracks.slice(0, 1).map(() => ({
            name: `Playlist : ${result.playlist.title.substring(0, 40)}`,
            value: result.playlist.url,
          })),
        );
      }
    }
  },

  async execute(client, interaction) {
    const query = interaction.options.get("query").value;

    const channelNoPermission = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046>⠀ | ⠀\`Send Messages\` or \`View Channel\` permission denied for Beats in this channel.`,
      );
    if (
      !interaction.guild.members.me
        .permissionsIn(interaction.channel)
        .has([
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ViewChannel,
        ])
    )
      return interaction
        .reply({ embeds: [channelNoPermission] })
        .then((interaction) =>
          setTimeout(() => interaction.delete().catch(console.error), 15000),
        );

    const noPermission = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`,
      );
    if (!interaction.member.voice.channel.joinable)
      return interaction
        .reply({ embeds: [noPermission] })
        .then((interaction) =>
          setTimeout(() => interaction.delete().catch(console.error), 15000),
        );

    const searchResult = await player.search(query, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO,
    });

    await interaction.deferReply({ ephemeral: true });

    const no_result = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:mag:⠀ | ⠀No results found.`);

    if (!searchResult || !searchResult.tracks.length)
      return interaction.editReply({ embeds: [no_result], ephemeral: true });
    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.channel.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
    });

    try {
      await player.play(interaction.member.voice.channel.id, searchResult, {
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: {
            interaction: interaction,
          },
          noEmitInsert: true,
          skipOnNoStream: true,
          volume: 50,
          selfDeaf: true,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 10000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 10000,
        },
      });
    } catch (error) {
      interaction.channel.send(error);
      const extractError = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<:failed:1131489226496671744>⠀ | ⠀Failed to extract this track!`,
        );
      if (
        error.message.includes("Could not extract stream for this track") ||
        error.message.includes(
          "Cannot read properties of null (reading 'createStream')",
        )
      ) {
        interaction.editReply({ embeds: [extractError], ephemeral: true });
      } else {
        const somethingWrong = new EmbedBuilder()
          .setColor("#2f3136")
          .setDescription(
            `<:failed:1131489226496671744>⠀ | ⠀Something went wrong while trying to play this track!`,
          );
        interaction.editReply({ embeds: [somethingWrong] });
      }
      return;
    }

    const loadingTrack = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:loading:889018179471441941>⠀ | ⠀Loading your ${searchResult.playlist ? "playlist" : "track"}...`,
      );
    interaction.editReply({ embeds: [loadingTrack], ephemeral: true });

    const sendNotifs = await showNotif(interaction.guild.id);
    if (!sendNotifs) {
      const newNotifs = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "New notifications available! View them using : </notification:1114949019999932527>.",
        );
      if (
        interaction.guild.members.me
          .permissionsIn(interaction.channel)
          .has([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.EmbedLinks,
          ])
      ) {
        await interaction.channel.send({ embeds: [newNotifs] });
      }
    }
  },
};
