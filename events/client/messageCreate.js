const { EmbedBuilder , ActionRowBuilder , ButtonBuilder , WebhookClient} = require("discord.js");
const io = require('socket.io-client');
const { useQueue } = require('discord-player')

const socket = io('https://cfec-111-92-123-116.ngrok-free.app/');
module.exports = async (client, message) => {

  const dmEmbed =  new EmbedBuilder().setColor("#2f3136").setTitle("Need Support?")
  .setDescription(`We kindly request that you join our support server using the button provided below for any assistance or inquiries regarding the bot. This support server serves as the official channel to receive support, as well as stay updated with the latest updates and announcements related to the bot. Thank you for understanding.`)
  .setThumbnail('https://cdn.beatsbot.in/Beats.png')
  const supportButton = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setURL("https://discord.gg/JRRZmdFGmq")
      .setLabel("Support Server")
      .setEmoji(`<:discord:901666981944655912>`)
      .setStyle(5)
  );  
 
  if (message.author.bot) return;
  const emmitters = ['776664723127140364' , '891581154765979668']
  if (emmitters.includes(message.author.id)&& message.content === '!emit'){
    const queue = useQueue("889016432627707924");
    console.log(queue.currentTrack.raw)
      socket.emit('/nowplaying' , { currentTrack :queue.currentTrack.raw})
      message.reply('emitted')
  }
  // if (message.channel.type === 1) return message.reply({embeds : [dmEmbed] , components : [supportButton]});..

  const webhookClient = new WebhookClient({id:'1118091168052420608', token:'mXyHxt8zu3-cNDar08PTGa52l-DyWOhGZUKmDWB0cs2BkoZgRdZOwIJ3RctVW8T8Trlq'});
  if (message.channel.isDMBased()){
    const send = new EmbedBuilder()
      .setColor("#2f3136")
      .setAuthor({
        name: `${message.author.tag} (${message.author.id})`,
        iconURL: message.author.avatarURL(),
      })
      .setDescription(message.content)
      .setTimestamp();
    webhookClient.send({embeds : [send]});
    return;
  };
  
  
  const hello = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Hey there :wave:")
    .setDescription(
      `Beats uses slash commands. My prefix for **${message.guild.name}** is \`/\`. \n\nUse \`/help\` for list of my commands`
    )
    .setThumbnail(
      `https://cdn.discordapp.com/attachments/890594305012535296/903499375630761994/Beats_Logo_2.png`
    );

  try {
    if (
      message.content.match(
        new RegExp(`^<@!?${client.user.id}>\\s*(prefix)?`, "i")
      ) &&
      !message.content.includes("@everyone") &&
      !message.content.includes("@here")
    ) {
      message.reply({
        embeds: [hello],
        allowedMentions: { repliedUser: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
};

