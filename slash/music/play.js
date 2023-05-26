const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const playerOptions  = client.config.opt.discordPlayer;

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

    const searchResult = await player.search(query, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO,
    });


    await interaction.deferReply();

    const no_result = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:mag:⠀ | ⠀No results found.`);
    
    if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ embeds: [no_result], ephemeral: true });

    player.play(interaction.member.voice.channel.id, searchResult, {
        nodeOptions: {
          metadata:{
            interaction : interaction,
           },
           playerOptions
        },
    });
    
    const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your ${searchResult.playlist ? "playlist" : "track"}...`);
    interaction.editReply({ embeds: [loadingTrack] })
               .then((interaction) => setTimeout(() => interaction.delete(), 15000));

    searchResult.playlist ? queue.addTrack(searchResult.tracks): queue.addTrack(searchResult.tracks[0]);
  },
};
