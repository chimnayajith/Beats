const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');
const db = require('../../models/lifetimeVotes')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-vote")
    .setDescription("Check if you have voted for Beats"),

  voiceChannel: false,
  vote: false,
  category: "Infos",
  utilisation: "/check-vote",

  async execute(client, interaction) {
    const userData = await db.findOne({
      id : interaction.user.id
    })

    const embed = new EmbedBuilder().setColor("#2f3136");
    const lifetimeVotes = userData ? userData.lifetimeVotes : 0 
    axios.get(`https://discordbotlist.com/api/v1/bots/886801342239211522/upvotes`, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijg4NjgwMTM0MjIzOTIxMTUyMiIsImlhdCI6MTY4Njc0ODE0OH0.HMQfxiIqF-FNzZP9M4tCzdcr58xSwU7HwocOwz_95Q0`
        }
      })
        .then((response) => {
            const data = response.data.upvotes;
            const voted =  data.some(item => item.user_id === interaction.user.id)

            if (!voted){
              embed.setTitle('Vote now!').setDescription(`You have voted ${lifetimeVotes} times.\nYou haven't voted in the last 12 hours!`)
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://discordbotlist.com/bots/beats-9741/upvote').setLabel("Vote Now!")
              )

              interaction.reply({ embeds : [embed] , components : [row]});
            } else {
              const date = new Date(userData.updatedAt)
              embed.setTitle('Already Voted!').setDescription(`You have voted \`${lifetimeVotes}\` times.\nYou voted in the last 12 hours. You can vote <t:${Math.round(date.getTime() /1000) + 43200}:R>`)
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://discordbotlist.com/bots/beats-9741/upvote').setLabel("Vote Now!").setDisabled()
              )
              interaction.reply({ embeds : [embed] , components : [row]});

            }
            
        })  


    
  },
};