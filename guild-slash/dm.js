const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder , ButtonBuilder , ActionRowBuilder , StringSelectMenuBuilder , PermissionFlagsBits} = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestions")
    .setDescription("get related tracks"),
  category: "Staff",
  utilisation: "",

  async execute(client, interaction) {
    
  const queue = player.nodes.get(interaction.guild.id);

  const relatedTracks = await queue.currentTrack.extractor.getRelatedTracks(queue.currentTrack); 

  console.log(relatedTracks.tracks.length)


   const searchEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`Suggestions!`)
      .setDescription(
       `\n\n${relatedTracks.tracks
        .map((t, i) => `**${i + 1}**) [${t.title} - ${t.author}](${t.url})`)
        .slice(0, 10)
        .join("\n")}\n\nSelect choice [1-10] or *cancel*`)
      // .setThumbnail("https://media.discordapp.net/attachments/889016433252634657/893442350918025226/bart_music.gif");


      const cancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn");
    const dCancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn").setDisabled();

    const cRow = new ActionRowBuilder().addComponents([cancel]);
    const dcRow = new ActionRowBuilder().addComponents([dCancel]);

    const mOptions = [
      { label: relatedTracks.tracks[0].title, value: "1" },
      { label: relatedTracks.tracks[1].title, value: "2" },
      { label: relatedTracks.tracks[2].title, value: "3" },
      { label: relatedTracks.tracks[3].title, value: "4" },
      { label: relatedTracks.tracks[4].title, value: "5" },
      { label: relatedTracks.tracks[5].title, value: "6" },
      { label: relatedTracks.tracks[6].title, value: "7" },
      { label: relatedTracks.tracks[7].title, value: "8" },
      { label: relatedTracks.tracks[8].title, value: "9" },
      { label: relatedTracks.tracks[9].title, value: "10" },
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



     const msg = await interaction.reply({embeds : [searchEmbed] , components : [mRow] , fetchReply : true})

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
        const switchint = parseInt(select) ;
        queue.addTrack(relatedTracks.tracks[switchint])
        await collected.deferUpdate();
        await collected.editReply({ embeds: [searchEmbed], components: [dmRow] });
       }
     });
  },
};
