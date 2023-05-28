const { EmbedBuilder , ActionRowBuilder , ButtonBuilder} = require("discord.js");

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
  if (message.channel.type === 1) return message.reply({embeds : [dmEmbed] , components : [supportButton]});
  
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
