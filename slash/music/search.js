const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,StringSelectMenuBuilder,ActionRowBuilder,PermissionFlagsBits} = require("discord.js");
const { QueryType } = require("discord-player");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("🎶 What song or playlist would you like to search?")
        .setRequired(true)
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/search <song name>",

  async execute(client, interaction) {
    const query = interaction.options.get("query").value;

    await interaction.deferReply();

    const searching = new EmbedBuilder().setDescription(`<a:searching1:899723106241880094>⠀ | ⠀Searching for **${query}**`);

    const msg = await interaction.editReply({
      embeds: [searching],
      fetchReply: true,
    });

    const searchResult = await player.search(query, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO_SEARCH,
    });
    const noResult = new EmbedBuilder().setColor("#2f3136").setDescription(`:mag:⠀ | ⠀No Results found`);

     if (!searchResult || !searchResult.tracks.length) return interaction.editReply({ embeds: [noResult] ,  ephemeral:true});
     
     const channelNoPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀\`Send Messages\` or \`View Channel\` permission denied for Beats in this channel.`);
     if(!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel])) return interaction.reply({embeds : [channelNoPermission]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 15000));

      const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
      if (!interaction.member.voice.channel.joinable) return interaction.editReply({embeds : [noPermission] , components : []});
      
      joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.channel.guild.id,
        adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
      });

     const loading = new EmbedBuilder().setColor("#2f3136").setTitle(`<a:loading:889018179471441941>⠀ | ⠀Loading your track...`);
     function play(track){
        
        player.play(interaction.member.voice.channel.id, track, {
            requestedBy: interaction.user,
            nodeOptions: {
              metadata:{
                interaction : interaction,
               },
               noEmitInsert: true,
               skipOnNoStream: true,
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
            },
        });
        
     }

     const searchEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`<:yt:889018080297119766> Search Results for : ${query}`)
      .setDescription(
       `\n\n${searchResult.tracks
        .map((t, i) => `**${i + 1}**) [${t.title}](${t.url})`)
        .slice(0, 10)
        .join("\n\n")}\n\nSelect choice [1-10] or *cancel*`)
      .setThumbnail("https://media.discordapp.net/attachments/889016433252634657/893442350918025226/bart_music.gif");

    const cancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn");
    const dCancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn").setDisabled();

    const cRow = new ActionRowBuilder().addComponents([cancel]);
    const dcRow = new ActionRowBuilder().addComponents([dCancel]);

    const mOptions = [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "10", value: "10" },
    ];

    const menu = new StringSelectMenuBuilder()
      .addOptions(mOptions)
      .setPlaceholder("Choose the song")
      .setCustomId("schMenu")
      .setMaxValues(1)
      .setMinValues(1);

    const dMenu = new StringSelectMenuBuilder()
      .addOptions(mOptions)
      .setPlaceholder("Choose the song")
      .setCustomId("schMenu")
      .setMaxValues(1)
      .setMinValues(1)
      .setDisabled();

    const mRow = new ActionRowBuilder().addComponents(menu);

    const dmRow = new ActionRowBuilder().addComponents(dMenu);

    interaction.editReply({ embeds: [searchEmbed], components: [mRow, cRow] });

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === interaction.user.id,
      time: 15000,
      errors: ["time"],
    });

     collector.on("collect", async (collected) => {
        if (collected.user.id !== interaction.user.id)
        return collected.reply({
          content: `<:huh:897560243624640563>  |  That command wasn't for you `,
          ephemeral: true,
        });

        if (collected.isButton()) {
        if (collected.customId === "cancel_btn") {
          await collected.deferUpdate();
          await collected.editReply({content :"Search Cancelled", embeds: [searchEmbed], components: [] });
        }
      }

       if (collected.isStringSelectMenu()) {
        const select = collected.values[0];
        const swtichint = parseInt(select) - 1;
        play(searchResult.tracks[swtichint]);
        await collected.deferUpdate();
        await collected.editReply({ embeds: [searchEmbed], components: [dmRow] });
       }
     });
  }
}