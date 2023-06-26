const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const vote = require("../utils/voteCheck")
const axios = require('axios');

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    //   const maintenance =  new EmbedBuilder()
    // .setColor('#2f3136')
    // .setTitle('<:coding:946448943812853761> ⠀|⠀Scheduled Maintenance Outage')
    // .setThumbnail('https://media.discordapp.net/attachments/889016433252634657/1056207020128219186/wdK4HwhYAAAAASUVORK5CYII.png')
    // .setDescription(` Beats is under maintenance at the moment. Join the [Support Server](https://discord.gg/JRRZmdFGmq) for more info.`)
    
    //if (interaction.user.id != '891581154765979668') return interaction.reply({embeds : [maintenance]});
    const embed1 = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`:microphone2:⠀ | ⠀Join a voice channel first!`);
    const embed2 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`
      );
    const cmd = await client.slashCommands.get(interaction.commandName);
	
      const vote_restricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle('Vote Restricted')
        .setDescription("This is a vote-restricted command. Please vote to use this command. You can also donate a small amount to bypass all vote-restricted commands for every month you donate.")
        .setThumbnail("https://images-ext-1.discordapp.net/external/9oXThT38s-OREhVmAkDeMoUcsNSMTrDZKEWwdAMLIeI/https/cdn.discordapp.com/emojis/777587011497623572.png")
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Vote").setURL('https://beatsbot.in/vote/dbl').setEmoji('<a:vote:956901647043416104>'),
          new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Donate").setURL('https://beatsbot.in/patreon').setEmoji('<:patreon:956903191507763240>')
        )

      //VOters on DBL
    if (cmd && cmd.vote) {
        const patrons = []//'891581154765979668' ,
      patron : if ( patrons.includes(interaction.user.id) ) {
        break patron;
      }
      else {
      axios.get(`https://discordbotlist.com/api/v1/bots/886801342239211522/upvotes`, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijg4NjgwMTM0MjIzOTIxMTUyMiIsImlhdCI6MTY4Njc0ODE0OH0.HMQfxiIqF-FNzZP9M4tCzdcr58xSwU7HwocOwz_95Q0`
        }
      })
        .then((response) => {
            const data = response.data.upvotes;
            const voted =  data.some(item => item.user_id === interaction.user.id)
            if (!voted) return interaction.reply({embeds : [vote_restricted] , components : [row] , ephemeral : true});
        })      
      }
    }

    if (cmd && cmd.voiceChannel) {
      if (!interaction.member.voice.channel)
        return interaction.reply({ embeds: [embed1], ephemeral: true });

      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      )
        return interaction.reply({ embeds: [embed2], ephemeral: true });
    }

    if (cmd) {
      if (interaction.commandName == cmd.data.name) {
        cmd.execute(client, interaction);
      }
    }
  }
};