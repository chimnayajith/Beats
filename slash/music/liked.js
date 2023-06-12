const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const likedSongs = require("../../utils/likedUtil")
const { QueryType , Track } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("liked")
    .setDescription("Play your liked songs!"),
  voiceChannel: true,
  vote: true,
  category: "Music",
  utilisation: "/liked",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const data = await likedSongs.getLiked(interaction.user.id);

    const noLiked = new EmbedBuilder().setColor("#2f3136").setDescription("<a:warn:889018313143894046> ⠀|⠀ You have no Liked Songs!")
    if (data === null) return interaction.reply({embeds : [noLiked] , ephemeral : true})
    

    const loadingLiked = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your \`Liked Songs (${data.length} tracks).\``)

    const tracks = [];
    for (const song of data) {
      const track = new Track(interaction.client, {
          author: song.author,
          description: song.description || song.title,
          duration: song.duration,
          thumbnail: song.thumbnail,
          title: song.title,
          url: song.url,
          views: song.views,
          requestedBy: client.users.resolve(song.requestedBy),
          queryType: QueryType.YOUTUBE_VIDEO,
          source: 'youtube',
          playlist: {
            title : "Liked Songs",
            thumbnail : "https://cdn.beatsbot.in/attachments/favourites.png",
            source : 'youtube',
            tracks :  data ,
          }
      });
      tracks.push(track)
  }

    const playlist = player.createPlaylist({
      author: { name: tracks[0].author, url: tracks[0].url },
      description: '',
      source: 'youtube',
      thumbnail: tracks[0].thumbnail,
      title: 'Liked Songs',
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
      interaction.reply({embeds: [loadingLiked]}).then((interaction) => setTimeout(() => interaction.delete(), 5000));
    } else{
      interaction.reply({embeds: [loadingLiked]}).then((interaction) => setTimeout(() => interaction.delete(), 5000));
      queue.addTrack(playlist.tracks)
    }
  },
};