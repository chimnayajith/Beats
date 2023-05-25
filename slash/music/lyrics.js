const {
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js");
const Genius = require("genius-lyrics");
const Client = new Genius.Client(
  "OwQvGapg8vzwCdGW6cnk9zh9I_ECJ6QguMu-HVm211__nFNboPERdjbe4tt-RBJM"
);
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Lyrics of the song playing or specified")
    .addStringOption((option) =>
      option.setName("query").setDescription("Song name").setRequired(false)
    ),
  voiceChannel: true,
  vote: true,
  category: "Music",
  utilisation: "/lyrics <song name>",
  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);
    let query = interaction.options.get("query");

    const embed1 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(":mag:⠀ | ⠀Provide a track!");
    if (!queue && !query)
      return interaction.reply({ embeds: [embed1], ephemeral: true });

    if (!interaction.options.get("query")) {
      sed =
        queue.currentTrack.title +
        " " +
        queue.currentTrack.author;
      query = sed;
    } else {
      query = interaction.options.get("query").value;
    }
    const noresult = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `**:x:⠀ | ⠀Could not find song .  Try using**\n\n\`\`\`yaml\n\\lyrics <song name> <artist>\`\`\``
      );

    interaction.deferReply();

    let pages = [];
    let current = 0;

    const searches = await Client.songs.search(query);
    const firstSong = await searches[0];
    if (!firstSong)
      return interaction.editReply({ embeds: [noresult], ephemeral: true });
    const lyrics = await firstSong.lyrics();
    const total = Math.ceil(lyrics.length / 1024);

    for (let i = 0; i < lyrics.length; i += 1024) {
      let lyricpage = lyrics.substr(i, Math.min(lyrics.length, i + 1024));
      //let lyricpage = String.substr(from:i , length?:Math.min(lyrics.length , i + 1024)) : lyrics
      pageno = Math.floor(i / 1024);
      const page = new EmbedBuilder()
        .setTitle(`LYRICS | ${firstSong.fullTitle}`)
        .setThumbnail(firstSong.thumbnail)
        .setDescription(lyricpage)
        .setFooter({ text: `Page : ${pageno + 1}/${total}` });
      pages.push(page);
    }
    const prev = new ButtonBuilder()
      .setEmoji("<:left_arroe:901325048189698078>")
      .setStyle(2)
      .setCustomId("prev_page");
    const stop = new ButtonBuilder()
      .setEmoji(`⛔`)
      .setStyle(4)
      .setCustomId("cancel_btn");
    const next = new ButtonBuilder()
      .setEmoji(`<:right_arroe:901325048261005322>`)
      .setStyle(2)
      .setCustomId("next_page");
    const row = new ActionRowBuilder().addComponents([prev, stop, next]);

    const dprev = new ButtonBuilder()
      .setEmoji("<:left_arroe:901325048189698078>")
      .setStyle(2)
      .setCustomId("prev_page")
      .setDisabled();
    const dstop = new ButtonBuilder()
      .setEmoji(`⛔`)
      .setStyle(4)
      .setCustomId("cancel_btn")
      .setDisabled();
    const dnext = new ButtonBuilder()
      .setEmoji(`<:right_arroe:901325048261005322>`)
      .setStyle(2)
      .setCustomId("next_page")
      .setDisabled();
    const drow = new ActionRowBuilder().addComponents([dprev, dstop, dnext]);
    const msg = await interaction.editReply({
      embeds: [pages[current]],
      components: [row],
      fetchRreply: true,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: 2,
    });

    collector.on("collect", async (collected) => {
      if (collected.customId === "next_page") {
        await collected.deferUpdate();
        if (current < pages.length - 1) {
          current += 1;
          await collected.editReply({
            embeds: [pages[current]],
            components: [row],
          });
        }
      }
      if (collected.customId === "prev_page") {
        await collected.deferUpdate();
        if (current !== 0) {
          current -= 1;
          await collected.editReply({
            embeds: [pages[current]],
            components: [row],
          });
        }
      }
      if (collected.customId === "cancel_btn") {
        await collected.deferUpdate();
        collector.stop();
        await collected.editReply({ components: [drow] });
      }
    });
  },
};
