const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { showNotif} = require("../../utils/notifUtil")
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
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/play <song name/url>",

  async execute(client, interaction) {
    const query = interaction.options.get("query").value;

    const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
    if (!interaction.member.voice.channel.joinable) return interaction.reply({embeds : [noPermission]});

    const searchResult = await player.search(query, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO,
    });


    await interaction.deferReply();

    const no_result = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:mag:⠀ | ⠀No results found.`);
    
    if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ embeds: [no_result], ephemeral: true });
    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.channel.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
    });

    player.play(interaction.member.voice.channel.id, searchResult, {
      requestedBy: interaction.user,
        nodeOptions: {
          metadata:{
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
    },
        },
    });
    
    const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your ${searchResult.playlist ? "playlist" : "track"}...`);
    interaction.editReply({ embeds: [loadingTrack] }).then((interaction) => setTimeout(() => interaction.delete(), 15000));

    const sendNotifs = await showNotif(interaction.guild.id)
    if (! sendNotifs){
      const newNotifs = new EmbedBuilder().setColor("#2f3136").setDescription("New notifications available! View them using : </notification:1114949019999932527>.")
      await interaction.channel.send({embeds : [newNotifs]});
    }
    
  },
};
