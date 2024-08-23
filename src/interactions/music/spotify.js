const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const CryptoJS = require("crypto-js");
const spotifyPlaylists = require("../../models/spotifyPlaylists");
const { joinVoiceChannel } = require("@discordjs/voice");
const { QueryType } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("spotify")
    .setDescription("Play spotify playlists from your account!s")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("connect")
        .setDescription("Connect to your spotify account"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Choose from your spotify playlists!"),
    ),

  voiceChannel: false,
  vote: false,
  category: "Music",
  utilisation: "/spotify",

  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "connect") {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify({
          userID: interaction.user.id,
          expirationTimestamp: Date.now() + 300000,
        }),
        "886801342239211522",
      ).toString();
      const connectSpotify = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `Connect your Spotify account by authorizing through the provided link .**[Click here](https://api.beatsbot.in/api/spotify/login?state=${btoa(encrypted)})**.\nPlease note that this link is for your personal use only and should not be shared with others. Sharing the link may allow unauthorized access to integrate their Spotify account with Beats!.\n\n Once authorized, you'll receive a DM (if your DMs are open) confirming the successful connection.\n\nAfter connecting, use the command </spotify play:1123951862236852304> to access your playlists and add them to the queue effortlessly.\n\nPlease be aware that this message will be automatically deleted in 5 minutes for security purposes.`,
        )
        .setTitle("<:spotify:1123967292900900965> Spotify Authorisation");
      const dmAuth = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "Authorization links and details have been sent to your direct messages (DM). Please check your DMs promptly as the message will be automatically deleted after 5 minutes.",
        );
      const dmClosed = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<a:warn:889018313143894046> ⠀|⠀ Authorization details and links will be sent via DM. Please change your privacy settings allowing Beats to send a DM.`,
        );

      interaction.user
        .send({ embeds: [connectSpotify] })
        .then((message) => {
          setTimeout(() => message.delete(), 300000);
          interaction.reply({ embeds: [dmAuth], ephemeral: true });
        })
        .catch(() => {
          interaction.reply({ embeds: [dmClosed], ephemeral: true });
        });
    } else if (interaction.options.getSubcommand() === "play") {
      const userData = await spotifyPlaylists.findOne({
        _id: interaction.user.id,
      });
      const notIntegrated = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "You don't have a linked Spotify account. To authorize your Spotify account and access all your playlists in Beats, use the command </spotify connect:1123951862236852304>.",
        );
      if (!userData)
        return interaction.reply({ embeds: [notIntegrated], ephemeral: true });

      const playlistData = userData.spotifyPlaylistItems;
      const noPlaylists = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription("You do not have any public playlists!");

      if (!(playlistData.length > 0))
        return interaction.reply({ embeds: [noPlaylists], ephemeral: true });
      const availablePlaylists = [];
      const pages = [];
      const playlistsEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle(
          `<:spotify:1123967292900900965> Spotify Playlists Test: ${interaction.user.username}`,
        )
        .setThumbnail(
          `https://media.discordapp.net/attachments/889016433252634657/1124046362615500820/306f6a14403921a4d8b4ab53d3c9f2a3.png`,
        );
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:left_arroe:901325048189698078>")
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId("balaaaa")
          .setLabel("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀")
          .setStyle(2)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("<:right_arroe:901325048261005322>")
          .setStyle(2),
      );
      const paginatePlaylists = () => {
        playlistsEmbed
          .setDescription(pages[current])
          .setFooter({ text: `Page : ${current + 1}/${pages.length}` });
      };
      const options = [];
      const options2 = [];
      var availableOptions = 0;
      const playlistInfo = playlistData
        .filter(
          (playlist) =>
            playlist.public || playlist.owner.uri === "spotify:user:spotify",
        )
        .map((playlist, i) => {
          availablePlaylists.push(playlist);
          const { external_urls, name, tracks } = playlist;
          const trackCount = tracks.total.toString();
          const playlistName =
            name.length > 22 ? name.substring(0, 19) + "..." : name;
          availableOptions++;
          i <= 24
            ? options.push({ label: playlistName, value: `${i}` })
            : options2.push({ label: playlistName, value: `${i}` });
          return `${i + 1}) [${playlistName}](${external_urls.spotify})\u2003•\u2003${trackCount} tracks`;
        });
      const row1 = new ActionRowBuilder();
      const row2 = new ActionRowBuilder();
      if (availableOptions > 24) {
        pages.push(playlistInfo.slice(0, 25).join("\n"));
        pages.push(playlistInfo.slice(25, availableOptions).join("\n"));
        row1.addComponents(
          new StringSelectMenuBuilder()
            .addOptions(options)
            .setPlaceholder("Choose the playlist")
            .setCustomId("spotifyMenu1")
            .setMaxValues(1)
            .setMinValues(1),
        );
        row2.addComponents(
          new StringSelectMenuBuilder()
            .addOptions(options2)
            .setPlaceholder("Choose the playlist")
            .setCustomId("spotifyMenu2")
            .setMaxValues(1)
            .setMinValues(1),
        );
      } else {
        pages.push(playlistInfo.join("\n"));
        row1.addComponents(
          new StringSelectMenuBuilder()
            .addOptions(options)
            .setPlaceholder("Choose the playlist")
            .setCustomId("spotifyMenu1")
            .setMaxValues(1)
            .setMinValues(1),
        );
      }
      let current = 0;
      paginatePlaylists();
      const playlists =
        pages.length > 1
          ? await interaction.reply({
              embeds: [playlistsEmbed],
              components: [row1, row],
              fetchReply: true,
            })
          : await interaction.reply({
              embeds: [playlistsEmbed],
              components: [row1],
              fetchReply: true,
            });

      const collector = playlists.createMessageComponentCollector({});

      collector.on("collect", async (collected) => {
        if (collected.componentType === 2) {
          await collected.deferUpdate();

          const notYourPlaylist = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `<:huh:897560243624640563>⠀|⠀ This is not your playlist!`,
            );
          if (collected.user.id !== interaction.user.id)
            return collected.followUp({
              embeds: [notYourPlaylist],
              ephemeral: true,
            });

          const value = collected.customId;
          if (value === "next") {
            current === availablePlaylists.length - 1 ? current : current++;
            paginatePlaylists();
            collected.editReply({
              embeds: [playlistsEmbed],
              components: [row2, row],
            });
          } else if (value === "previous") {
            current === 0 ? current : current--;
            paginatePlaylists();
            collected.editReply({
              embeds: [playlistsEmbed],
              components: [row1, row],
            });
          }
        } else if (collected.componentType === 3) {
          await collected.deferUpdate();

          const notYourPlaylist = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `<:huh:897560243624640563>⠀|⠀ This is not your playlist!`,
            );
          if (collected.user.id !== interaction.user.id)
            return collected.followUp({
              embeds: [notYourPlaylist],
              ephemeral: true,
            });

          // Search playlist!
          const query =
            availablePlaylists[parseInt(collected.values[0])].external_urls
              .spotify;
          const searchResult = await player.search(query, {
            requestedBy: interaction.member,
            searchEngine: QueryType.SPOTIFY_PLAYLIST,
          });

          // No results!
          const no_result = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `:mag:⠀ | ⠀No results found. This might be a spotify wrapped or blend!`,
            );
          if (!searchResult || !searchResult.tracks.length)
            return collected
              .editReply({
                embeds: [no_result],
                components: [],
                ephemeral: true,
              })
              .then((message) =>
                setTimeout(() => message.delete().catch(console.error), 20000),
              );

          // Not in voice or Different voice channel
          const noVoice = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `<a:warn:889018313143894046>⠀ | ⠀Join a voice channel first!`,
            );
          const diffVoice = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`,
            );
          if (!interaction.member.voice.channel)
            return collected.followUp({
              embeds: [noVoice],
              components: [],
              ephemeral: true,
            });
          if (
            interaction.guild.members.me.voice.channel &&
            interaction.member.voice.channel.id !==
              interaction.guild.members.me.voice.channel.id
          )
            return collected.followUp({
              embeds: [diffVoice],
              components: [],
              ephemeral: true,
            });

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
                setTimeout(
                  () => interaction.delete().catch(console.error),
                  15000,
                ),
              );

          // joining voice channel manually!
          joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
          });

          player.play(interaction.member.voice.channel.id, searchResult, {
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
          const loadingTrack = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${availablePlaylists[parseInt(collected.values[0])].name}](${availablePlaylists[parseInt(collected.values[0])].external_urls.spotify})`,
            );
          collected
            .editReply({ embeds: [loadingTrack], components: [] })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000),
            );
        }
      });
    }
  },
};
