const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { getNotifs , addRead } = require("../../common/utils/scripts/notifUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notification")
    .setDescription("View notifications from Beats!"),

  voiceChannel: false,
  vote: false,
  category: "Infos",
  utilisation: "/notification",

  async execute(client, interaction) {
    const data = await getNotifs();

    let current = 0;

    const noNotifs = new EmbedBuilder().setColor("#2f3136").setDescription("<a:warn:889018313143894046>⠀ | ⠀No notifications currently!");
    const notifEmbed = new EmbedBuilder().setColor("#2f3136").setThumbnail("https://cdn.beatsbot.in/Beats.png");
    const row  = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('previous').setEmoji('<:left_arroe:901325048189698078>').setStyle(2),
      new ButtonBuilder().setCustomId('next').setEmoji('<:right_arroe:901325048261005322>').setStyle(2),
    )

    function paginateNotifs (){
      notifEmbed.setDescription(data[current]).setFooter({text : `Page : ${current + 1}/${data.length}`})
    }

    if (data.length === 0 ){
      interaction.reply({embeds : [noNotifs] , ephemeral : true})
    } else {
      notifEmbed.setTitle(`You have ${data.length} notification(s)`)
      paginateNotifs()
      const notif = (data.length > 1) ? await interaction.reply({embeds : [notifEmbed] , components : [row] , fetchReply : true}) : await interaction.reply({embeds : [notifEmbed] , fetchReply: true})

      addRead(interaction.guild.id)

      const collector = notif.createMessageComponentCollector({
        componentType: 2,
      });

      collector.on("collect", async (collected) => {
       const value = collected.customId;
       await collected.deferUpdate();
       if (value === "next"){
        ( current === data.length -1) ? current : current++;
        paginateNotifs()
        collected.editReply({ embeds : [notifEmbed] , components : [row]})
       } else if ( value === "previous"){
        ( current === 0) ? current : current--;
        paginateNotifs()
        collected.editReply({ embeds : [notifEmbed] , components : [row]})
       }
      });
    }
  },
};