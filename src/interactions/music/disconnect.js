const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ButtonStyle , ActionRowBuilder , ModalBuilder , TextInputBuilder ,TextInputStyle , WebhookClient} = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const db = require('../../models/reports')
const util = require("../../common/utils/scripts/reportAdd")
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect from voice channel"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/disconnect",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);
    const connection = getVoiceConnection(interaction.member.voice.guild.id) || player.voiceUtils.getConnection(interaction.member.voice.guild.id);
    const notConnected = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Not Connected to a voice channel!`);
    if (!connection) return interaction.reply({embeds : [notConnected]})

    embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`<a:tick:889018326255288360>⠀ | ⠀Beats has been \`disconnected\`.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Feedback!").setCustomId('feedback').setStyle(ButtonStyle.Secondary)
    )
    if (queue) {
      try {
        queue.delete();
      } catch (err) {
        console.log(err);
      }
    } else {
      connection.destroy();
    }
    const msg  = await interaction.reply({ embeds: [embed] ,components : [row] , fetchReply : true }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
    await logIfRequired(interaction.guild.id ,interaction.guild.ownerId, "controlLogs" , {
      guildName: interaction.guild.name,
      guildID: interaction.guild.id,
      guildIcon: interaction.guild.iconURL(),
      command : "disconnect",
      userID : interaction.user.id ,
      textChannel : interaction.channel.id
    });
    const collector = msg.createMessageComponentCollector({
      componentType : 2
    })

    const modal = new ModalBuilder()
        .setCustomId('feedback-disconnect')
        .setTitle('Feedback');

    const description = new TextInputBuilder()
      .setCustomId('desc')
      .setLabel("Provide your feedback")
      .setPlaceholder('Please give your valuable feedback')
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
            
    const desc_row = new ActionRowBuilder().addComponents(description)

    modal.addComponents(desc_row)

    collector.on('collect' , async (collected) => {
      collected.showModal(modal)
      collected.awaitModalSubmit({time : 600000}) .then( async modal => {
        const feedback = modal.fields.getTextInputValue('desc')
        let newdata = await db.create({
          userID: interaction.user.id,
          username: interaction.user.username,
          message : feedback,
        });
        newdata.save();

        const newFeedback = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("New Feedback")
          .setAuthor({iconURL : interaction.user.avatarURL(),name : `${interaction.user.username} (${interaction.user.id})` })
          .setDescription(`${feedback}\n\n[Click here](https://admin.beatsbot.in/reports/${newdata._id})`)
          .setThumbnail('https://cdn.beatsbot.in/Beats.png')

        const webhookClient = new WebhookClient({url : "https://discord.com/api/webhooks/1124816167861751828/KIjR_ic0kMo4StMl-iuzyHXrSPwcIzXVSFoyKu8Oo0Ti2qUDcmj9Iie2bGwOFCAxKwkD"});
        webhookClient.send({embeds : [newFeedback]});

        const submitted = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360>⠀ | ⠀Feedback Submitted`);
        modal.reply({embeds : [submitted] , ephemeral: true})
        }).catch((err) => { 
          const time_error = new EmbedBuilder().setColor("#2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀ The feedback modal timed out.")
          interaction.followUp({embeds : [time_error] , ephemeral : true})
        });
        
    })
    
  },
};
