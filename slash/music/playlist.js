const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
} = require("discord.js");
const playlists = require("../../models/playlist");
const pretty = require("pretty-ms");
const { QueryType , Track} = require("discord-player");
const axios = require('axios') 
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Save playlist and load them later")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("save")
        .setDescription("Saves the current queue as a playlist")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the playlist")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("load").setDescription("Load your saved playlist")
    ),
  vote: true,
  voiceChannel: true,
  category: "Music",
  utilisation: "/playlist save or /playlist load",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);
    if (interaction.options.getSubcommand() === "save") {
      
      const embed1 = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `**<a:warn:889018313143894046> ⠀|⠀ No Playlist to save! Add some songs to the queue**`
        );
      if (!queue)
        return interaction.reply({ embeds: [embed1], ephemeral: true });

      const embed2 = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `**<a:warn:889018313143894046> ⠀|⠀ Cannot save playlist. Only one song in the queue**`
        );
      if (!queue.tracks.toArray()[0])
        return interaction.reply({ embeds: [embed2], ephemeral: true });

      const arr = queue.tracks.map((track) => ({
        source : track.raw.source,
        title : track.title,
        description : track.raw.description,
        author : track.author,
        url : track.raw.url || track.url,
        thumbnail : track.thumbnail,
        duration : track.duration,
        views : track.views,
        requestedBy:track.requestedBy.id,
        queryType: track.queryType
      }));
      
      const currentData = {
        source : queue.currentTrack.raw.source,
        title : queue.currentTrack.title,
        description : queue.currentTrack.raw.description,
        author : queue.currentTrack.author,
        url : queue.currentTrack.raw.url || queue.currentTrack.url,
        thumbnail : queue.currentTrack.thumbnail,
        duration : queue.currentTrack.duration,
        views : queue.currentTrack.views,
        requestedBy:queue.currentTrack.requestedBy.id,
        queryType: queue.currentTrack.queryType
      }
      arr.unshift(currentData);

      const length = queue.estimatedDuration;
      const duration = pretty(length);

      const dataQuery = await playlists.find({ userID: interaction.user.id });
      const allData = dataQuery.map((data) => {
        data;
      });

      const max_playlist = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Maximum Playlists")
        .setDescription(
          "You have already saved 2 playlist. Delete a playlist to save another one!\n\n Use the `/playlist load` command to delete a playlist."
        );
      if (allData.length == 2)
        return interaction.reply({ embeds: [max_playlist], ephemeral: true });

      let newdata = await playlists.create({
        userID: interaction.user.id,
        playlistName: interaction.options.get("name").value,
        playlist: arr,
        tracks: arr.length,
        Duration: duration,
      });
      newdata.save();

      const saved = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Playlist saved")
        .setThumbnail("https://cdn.beatsbot.in/attachments/playlists.png")
        .addFields(
          {
            name: "Playlist Name",
            value: `\`${interaction.options.get("name").value}\``,
            inline: true,
          },
          { name: `\u200B`, value: "\u200B", inline: true },
          { name: "Owner", value: `\`${interaction.user.tag}\``, inline: true },
          { name: "Tracks", value: `\`${arr.length}\``, inline: true },
          { name: `\u200B`, value: "\u200B", inline: true },
          { name: "Duration", value: `\`${duration}\``, inline: true }
        );
      interaction.reply({ embeds: [saved] });
    } 
    
    else if (interaction.options.getSubcommand() === "load") {
      const dataQuery = await playlists.find({ userID: interaction.user.id });
      const allData = dataQuery.map((data) => {
        data;
      });

      const no_playlist = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("No Saved Playlists")
        .setDescription(
          "You have no saved playlist!\n\n Use the `/playlist save` command to create a playlist."
        );
      if (allData.length == 0)
        return interaction.reply({ embeds: [no_playlist], ephemeral: true });

      const list = dataQuery
        .map(
          (data, i) =>
            `${i + 1}) **${data.playlistName}**⠀•⠀${data.tracks} tracks⠀•⠀${
              data.Duration
            }`
        )
        .join("\n\n");
      const list_embed = new EmbedBuilder()
        .setColor("2f3136")
        .setAuthor({ name: `Author: ${interaction.user.tag}` })
        .setTitle("Your Playlists")
        .setDescription(list)
        .setThumbnail(interaction.user.displayAvatarURL());

      const mOptions =
        dataQuery.length == 1
          ? [{ label: `${dataQuery[0].playlistName}`, value: "pl1" }]
          : [
              { label: `${dataQuery[0].playlistName}`, value: "pl1" },
              { label: `${dataQuery[1].playlistName}`, value: "pl2" },
            ];
      const menu = new StringSelectMenuBuilder()
        .addOptions(mOptions)
        .setPlaceholder("Choose the playlist")
        .setCustomId("plMenu")
        .setMaxValues(1)
        .setMinValues(1);

      const mRow = new ActionRowBuilder().addComponents(menu);

      const msg = await interaction.reply({
        embeds: [list_embed],
        components: [mRow],
        fetchReply: true,
      });

      const collector = msg.createMessageComponentCollector({
        filter: ({ user }) => user.id === interaction.user.id,
        time: 15000,
        errors: ["time"],
        componentType: 3,
        max: 1,
      });

      collector.on("collect", async (collected) => {
        
        if (collected.user.id !== interaction.user.id)
          return collected.reply({
            content: `<:huh:897560243624640563>  |  That command wasn't for you `,
            ephemeral: true,
          });

        const select = collected.values[0];
        if (select === "pl1") {
          const preview = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle(`Playlist : ${dataQuery[0].playlistName}`)
            .setAuthor({ name: `Author : ${interaction.user.tag}` })
            .setDescription(
              `**Tracks ⠀⠀⠀: ** ${dataQuery[0].tracks}\n**Duration ⠀: ** ${dataQuery[0].Duration}⠀⠀⠀⠀`
            )
            .setThumbnail(dataQuery[0].image);
          const play = new ButtonBuilder()
            .setCustomId("play")
            .setLabel("⠀⠀⠀⠀Play⠀⠀⠀")
            .setStyle(3);
          const dlt = new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("⠀⠀⠀⠀Delete⠀⠀⠀")
            .setStyle(4);
          const row = new ActionRowBuilder().addComponents(play, dlt);

          collected.deferUpdate();
          const preview_embed = await interaction.editReply({
            embeds: [preview],
            components: [row],
          });

          const collector1 = preview_embed.createMessageComponentCollector({
            filter: ({ user }) => user.id === interaction.user.id,
            time: 15000,
            componentType: 2,
            max: 1,
            errors: ["time"],
          });

          collector1.on("collect", async (collected1) => {
            collected1.deferUpdate();

            if (collected1.customId === "play") {
              const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
              if (!interaction.member.voice.channel.joinable) return interaction.editReply({embeds : [noPermission] , components : []});
              joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.channel.guild.id,
                adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
              });
              const loading = new EmbedBuilder()
                .setColor("2f3136")
                .setDescription(
                  `<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : **${dataQuery[0].playlistName}**`
                );
              const arr = dataQuery[0].playlist;
                const tracks = [];
                for (const song of arr) {
                  const track = new Track(interaction.client, {
                      author: song.author,
                      description: song.description || song.title,
                      duration: song.duration,
                      thumbnail: song.thumbnail,
                      title: song.title,
                      url: song.url,
                      views: song.views,
                      requestedBy: client.users.resolve(song.requestedBy),
                      queryType: QueryType.SPOTIFY_SONG,
                      source: 'spotify',
                      playlist: {
                        title : dataQuery[0].playlistName,
                        thumbnail : dataQuery[0].image ,
                        source : 'spotify',
                        tracks :  arr ,
                      }
                  });
                  tracks.push(track)
                  }

                  const playlist = player.createPlaylist({
                    author: { name: tracks[0].author, url: tracks[0].url },
                    description: '',
                    source: 'spotify',
                    thumbnail: dataQuery[0].image,
                    title: dataQuery[0].playlistName,
                    tracks,
                    type: 'playlist',
                    url: tracks[0].url
                  });

                  if(!queue) {
                    const queue = player.nodes.create(interaction.guild, {
                      metadata: {
                            interaction : interaction,
                      },
                      volume: 50,
                      selfDeaf: true,
                      leaveOnEmpty: true,
                      leaveOnEmptyCooldown: 10000,
                      leaveOnEnd: true,
                      leaveOnEndCooldown: 10000,
                      ytdlOptions: {
                        quality: "highest",
                        filter: "audioonly",
                        highWaterMark: 1 << 25,
                        dlChunkSize: 0,
                        requestOptions: {
                          headers: {
                            cookie:client.config.var.yt_cookie ,
                          },
                        },
                        }
                     })
              
                     if (!queue.connection) await queue.connect(interaction.member.voice.channel);
              
                     queue.addTrack(playlist)
                     queue.node.play()
                     interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete(), 5000));
                  } else{
                    interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete(), 5000));
                    queue.addTrack(playlist.tracks)
                  } 

            } else if (collected1.customId === "delete") {
              const dlt_confirm = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle("Confirmation")
                .setDescription(
                  `Are you sure you want to delete the playlist : **${dataQuery[0].playlistName}** ?`
                );
              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Confirm")
                .setStyle(3);
              const cancel = new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle(4);
              const row = new ActionRowBuilder().addComponents(confirm, cancel);

              const dlt_msg = await interaction.editReply({
                embeds: [dlt_confirm],
                components: [row],
              });

              del = dlt_msg.createMessageComponentCollector({
                filter: ({ user }) => user.id === interaction.user.id,
                time: 15000,
                componentType: 2,
                max: 1,
                errors: ["time"],
              });
              del.on("collect", async (collected2) => {
                if (collected2.customId === "confirm") {
                  await playlists.deleteOne({
                    _id: dataQuery[0]._id,
                  });
                  axios.post(`https://api.beatsbot.in/api/playlists/image/delete?id=${dataQuery[0]._id}`)

                  collected2.deferUpdate();
                  const deleted = new EmbedBuilder()
                    .setColor("#2f3136")
                    .setTitle("Playlist deleted succesfully");
                  interaction
                    .editReply({ embeds: [deleted], components: [] })
                    .then((i) => setTimeout(() => i.delete(), 5000));
                } else if (collected2.customId === "cancel") {
                  const cancelled = new EmbedBuilder()
                    .setColor("#2f3136")
                    .setTitle("Deletion cancelled");
                  interaction
                    .editReply({ embeds: [cancelled], components: [] })
                    .then((i) => setTimeout(() => i.delete(), 5000));
                }
              });
              del.on("end", (collected, error) => {
                if (error === "time") {
                  interaction.deleteReply();
                }
              });
            }
          });
          collector1.on("end", (collected, error) => {
            if (error === "time") {
              interaction.deleteReply();
            }
          });
        } else if (select === "pl2") {
          {
            const preview = new EmbedBuilder()
              .setColor("#2f3136")
              .setTitle(`Playlist : ${dataQuery[1].playlistName}`)
              .setAuthor({ name: `Author : ${interaction.user.tag}` })
              .setDescription(
                `**Tracks ⠀⠀⠀: ** ${dataQuery[1].tracks}\n**Duration ⠀: ** ${dataQuery[1].Duration}⠀⠀⠀⠀`
              )
              .setThumbnail(dataQuery[1].image);
            const play = new ButtonBuilder()
              .setCustomId("play")
              .setLabel("⠀⠀⠀⠀Play⠀⠀⠀")
              .setStyle(3);
            const dlt = new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("⠀⠀⠀⠀Delete⠀⠀⠀")
              .setStyle(4);
            const row = new ActionRowBuilder().addComponents(play, dlt);

            collected.deferUpdate();
            const preview_embed = await interaction.editReply({
              embeds: [preview],
              components: [row],
            });

            const collector1 = preview_embed.createMessageComponentCollector({
              filter: ({ user }) => user.id === interaction.user.id,
              time: 15000,
              componentType: 2,
              max: 1,
              errors: ["time"],
            });

            collector1.on("collect", async (collected1) => {
              collected1.deferUpdate();

              if (collected1.customId === "play") {
                const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
                if (!interaction.member.voice.channel.joinable) return interaction.editReply({embeds : [noPermission], components : []});
                joinVoiceChannel({
                  channelId: interaction.member.voice.channel.id,
                  guildId: interaction.channel.guild.id,
                  adapterCreator: interaction.channel.guild.voiceAdapterCreator,
                });
                const loading = new EmbedBuilder()
                  .setColor("2f3136")
                  .setDescription(
                    `<a:loading:889018179471441941>⠀ | ⠀Loading playlist : **${dataQuery[1].playlistName}**`
                  );
                const arr = dataQuery[1].playlist;
                const tracks = [];
                for (const song of arr) {
                  const track = new Track(interaction.client, {
                      author: song.author,
                      description: song.description || song.title,
                      duration: song.duration,
                      thumbnail: song.thumbnail,
                      title: song.title,
                      url: song.url,
                      views: song.views,
                      requestedBy: client.users.resolve(song.requestedBy),
                      queryType: QueryType.SPOTIFY_SONG,
                      source: 'spotify',
                      playlist: {
                        title : dataQuery[1].playlistName,
                        thumbnail : dataQuery[0].image ,
                        source : 'spotify',
                        tracks :  arr ,
                      }
                  });
                  tracks.push(track)
                  }

                  const playlist = player.createPlaylist({
                    author: { name: tracks[1].author, url: tracks[1].url },
                    description: '',
                    source: 'spotify',
                    thumbnail: dataQuery[1].image,
                    title: dataQuery[1].playlistName,
                    tracks,
                    type: 'playlist',
                    url: tracks[1].url
                  });

                  if(!queue) {
                    const queue = player.nodes.create(interaction.guild, {
                      metadata: {
                            interaction : interaction,
                      },
                      volume: 50,
                      selfDeaf: true,
                      leaveOnEmpty: true,
                      leaveOnEmptyCooldown: 10000,
                      leaveOnEnd: true,
                      leaveOnEndCooldown: 10000,
                      ytdlOptions: {
                        quality: "highest",
                        filter: "audioonly",
                        highWaterMark: 1 << 25,
                        dlChunkSize: 0,
                        requestOptions: {
                          headers: {
                            cookie:client.config.var.yt_cookie ,
                          },
                        },
                        }
                     })
              
                     if (!queue.connection) await queue.connect(interaction.member.voice.channel);
              
                     queue.addTrack(playlist)
                     queue.node.play()
                     interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete(), 5000));
                  } else{
                    interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete(), 5000));
                    queue.addTrack(playlist.tracks)
                  } 
                  
              } else if (collected1.customId === "delete") {
                const dlt_confirm = new EmbedBuilder()
                  .setColor("#2f3136")
                  .setTitle("Confirmation")
                  .setDescription(
                    `Are you sure you want to delete the playlist : ${dataQuery[1].playlistName} ?`
                  );
                const confirm = new ButtonBuilder()
                  .setCustomId("confirm")
                  .setLabel("Confirm")
                  .setStyle(3);
                const cancel = new ButtonBuilder()
                  .setCustomId("cancel")
                  .setLabel("Cancel")
                  .setStyle(4);
                const row = new ActionRowBuilder().addComponents(
                  confirm,
                  cancel
                );

                const dlt_msg = await interaction.editReply({
                  embeds: [dlt_confirm],
                  components: [row],
                });

                del = dlt_msg.createMessageComponentCollector({
                  filter: ({ user }) => user.id === interaction.user.id,
                  time: 15000,
                  componentType: 2,
                  max: 1,
                  errors: ["time"],
                });
                del.on("collect", async (collected2) => {
                  if (collected2.customId === "confirm") {
                    //delete playlist
                    await playlists.deleteOne({
                      _id: dataQuery[1]._id,
                    });

                    //delete playlist image!
                    axios.post(`https://api.beatsbot.in/api/playlists/image/delete?id=${dataQuery[1]._id}`)
                    collected2.deferUpdate();
                    const deleted = new EmbedBuilder()
                      .setColor("#2f3136")
                      .setTitle("Playlist deleted succesfully");
                    interaction
                      .editReply({ embeds: [deleted], components: [] })
                      .then((i) => setTimeout(() => i.delete(), 5000));
                  } else if (collected2.customId === "cancel") {
                    const cancelled = new EmbedBuilder()
                      .setColor("#2f3136")
                      .setTitle("Deletion cancelled");
                    interaction
                      .editReply({ embeds: [cancelled], components: [] })
                      .then((i) => setTimeout(() => i.delete(), 5000));
                  }
                });
                del.on("end", (collected, error) => {
                  if (error === "time") {
                    interaction.deleteReply();
                  }
                });
              }
            });
            collector1.on("end", (collected, error) => {
              if (error === "time") {
                interaction.deleteReply();
              }
            });
          }
        }
      });
      collector.on("end", (collected, error) => {
        if (error === "time") {
          interaction.deleteReply();
        }
      });
    }
  },
};
