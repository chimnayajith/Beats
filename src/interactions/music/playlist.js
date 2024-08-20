const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");
const mongoose = require('mongoose');
const playlists = require("../../models/playlist");
const loadPrettyMs = async () => (await import('pretty-ms')).default;
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
      subcommand
      .setName("load")
      .setDescription("Load your saved playlist")
      .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the playlist")
        .setRequired(true)
        .setAutocomplete(true)
    )
    ),
  vote: true,
  voiceChannel: true,
  category: "Music",
  utilisation: "/playlist save or /playlist load",

  async autocomplete(interaction) {
    const data = await playlists.find({userID : interaction.user.id});
    if(data) return await interaction.respond(data.map((each) => ({ name : `${each.playlistName.substring(0, 80)} - ${each.tracks} tracks` , value : each._id})))
  },

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
      const pretty = await loadPrettyMs();
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
//..................................................................
//.lllll.....................................................ddddd..
//.lllll.....................................................ddddd..
//.lllll.....................................................ddddd..
//.lllll.....................................................ddddd..
//.lllll.........oooooooo...........aaaaaaaa..........dddddddddddd..
//.lllll........ooooooooooo........aaaaaaaaaa........ddddddddddddd..
//.lllll.......oooooooooooo.......oaaaaaaaaaaa.......ddddddddddddd..
//.lllll.......ooooooooooooo......oaaaa..aaaaa......addddddddddddd..
//.lllll......looooo...ooooo............aaaaaa......adddd...dddddd..
//.lllll......loooo....ooooo........aaaaaaaaaa......adddd....ddddd..
//.lllll......loooo....ooooo......oaaaaaaaaaaa......adddd....ddddd..
//.lllll......loooo....ooooo......oaaaaaaaaaaa......adddd....ddddd..
//.lllll......looooo...ooooo.....ooaaaa..aaaaa......adddd...dddddd..
//.lllll.......ooooooooooooo.....ooaaa..aaaaaa......addddddddddddd..
//.lllll.......oooooooooooo......ooaaaaaaaaaaa.......ddddddddddddd..
//.lllll........ooooooooooo.......oaaaaaaaaaaa.......ddddddddddddd..
//.lllll.........oooooooo..........aaaaaaaaaaa.........ddddddddddd..
//..................................................................
    else if (interaction.options.getSubcommand() === "load") {
      const playlistId = interaction.options.get('name').value;

      const invalidPlaylist = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Choose from an existing playlist!`);
      
      //not object id
      if( !mongoose.Types.ObjectId.isValid(playlistId)) return interaction.reply({embeds : [ invalidPlaylist] , ephemeral : true});

      const data = await playlists.findById({ _id : playlistId });

      const noTracks = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ No tracks added to \`${data.playlistName}\`. Use </server-playlists add:1126830641154109560> to add songs to the playlist`);
      if (data.tracks === 0) return interaction.reply({embeds : [noTracks] , ephemeral : true});

      const preview = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`Playlist : ${data.playlistName}`)
      .setAuthor({ name: `Author : ${interaction.user.tag}` })
      .setDescription(
        `**Tracks ⠀⠀⠀: ** ${data.tracks}\n**Duration ⠀: ** ${data.Duration}⠀⠀⠀⠀`
      )
      .setThumbnail(data.image);
      const play = new ButtonBuilder()
        .setCustomId("play")
        .setLabel("⠀⠀⠀⠀Play⠀⠀⠀")
        .setStyle(3);
      const dlt = new ButtonBuilder()
        .setCustomId("delete")
        .setLabel("⠀⠀⠀⠀Delete⠀⠀⠀")
        .setStyle(4);
      const row = new ActionRowBuilder().addComponents(play, dlt);

      const msg = await interaction.reply({
        embeds: [preview],
        components: [row],
        fetchReply : true
      });
      const collector = msg.createMessageComponentCollector({
        time: 15000,
        errors: ["time"],
        componentType: 2,
        max: 1,
      });
      collector.on("collect", async (collected1) => {
        collected1.deferUpdate();

        if (collected1.customId === "play") {

          const channelNoPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀\`Send Messages\`permission denied for Beats in this channel.`);
          if(!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel])) return interaction.reply({embeds : [channelNoPermission]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 15000));

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
              `<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : **${data.playlistName}**`
            );
          const arr = data.playlist;
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
                    title : data.playlistName,
                    thumbnail : data.image ,
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
                thumbnail: data.image,
                title: data.playlistName,
                tracks,
                type: 'playlist',
                url: tracks[0].url
              });

              if(!queue) {
                const queue = player.nodes.create(interaction.guild, {
                  metadata: {
                        interaction : interaction,
                  },
                  noEmitInsert: true,
                  volume: 50,
                  selfDeaf: true,
                  leaveOnEmpty: true,
                  leaveOnEmptyCooldown: 10000,
                  leaveOnEnd: true,
                  leaveOnEndCooldown: 10000,
                 })
          
                 if (!queue.connection) await queue.connect(interaction.member.voice.channel);
          
                 queue.addTrack(playlist)
                 queue.node.play()
                 interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 5000));
              } else{
                interaction.editReply({ embeds: [loading], components: [] }).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 5000));
                queue.addTrack(playlist.tracks)
              } 

        } else if (collected1.customId === "delete") {
          const dlt_confirm = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle("Confirmation")
            .setDescription(
              `Are you sure you want to delete the playlist : **${data.playlistName}** ?`
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
                _id: data._id,
              });
              axios.post(`https://api.beatsbot.in/api/playlists/image/delete?id=${data._id}`)

              collected2.deferUpdate();
              const deleted = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle("Playlist deleted succesfully");
              interaction
                .editReply({ embeds: [deleted], components: [] })
                .then((i) => setTimeout(() => i.delete().catch(console.error), 5000));
            } else if (collected2.customId === "cancel") {
              const cancelled = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle("Deletion cancelled");
              interaction
                .editReply({ embeds: [cancelled], components: [] })
                .then((i) => setTimeout(() => i.delete().catch(console.error), 5000));
            }
          });
          del.on("end", (collected, error) => {
            if (error === "time") {
              interaction.deleteReply();
            }
          });
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
