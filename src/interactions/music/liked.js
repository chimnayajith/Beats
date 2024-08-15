const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const likedSongs = require("../../common/utils/scripts/likedUtil")
const { QueryType , Track } = require("discord-player");
const { joinVoiceChannel } = require("@discordjs/voice");

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
    
    const channelNoPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀\`Send Messages\` or \`View Channel\`permission denied for Beats in this channel.`);
    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel])) return interaction.reply({embeds : [channelNoPermission]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 15000));
    
    const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
    if (!interaction.member.voice.channel.joinable) return interaction.reply({embeds : [noPermission]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 10000));
    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.channel.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
    });
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
          queryType: QueryType.SPOTIFY_SONG,
          source: 'spotify',
          playlist: {
            title : "Liked Songs",
            thumbnail : "https://cdn.beatsbot.in/attachments/favourites.png",
            source : song.source,
            tracks :  data ,
          }
      });
      tracks.push(track)
  }

    const playlist = player.createPlaylist({
      author: { name: tracks[0].author, url: tracks[0].url },
      description: '',
      source: 'spotify',
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
      interaction.reply({embeds: [loadingLiked] , ephemeral : true})
    } else{
      interaction.reply({embeds: [loadingLiked] , ephemeral : true})
      queue.addTrack(playlist.tracks)
    }
  },
};