const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder ,WebhookClient , PermissionFlagsBits} = require("discord.js");
const logger = require('../../utils/other/logger');
const { getVoiceConnection } = require("@discordjs/voice");
//player error
module.exports = async (queue , error) => {
    if(error.message.includes('read ENOTCONN')) {
        logger.warn(`read ENOTCONN detected in ${queue.guild.id}.. Trying to delete queue!`)
        const connection = getVoiceConnection(queue.guild.id)
       const enotconn = new EmbedBuilder().setColor("#2f3136").setDescription("Due to an error in the queue, it has been deleted.This is to prevent the bot from crashing. Join the [Support Server](https://discord.gg/JRRZmdFGmq) for more info.")
       if(queue.metadata.interaction.guild.members.me.permissionsIn(queue.metadata.interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel , PermissionFlagsBits.EmbedLinks])) {
           await queue.metadata.interaction.channel.send({embeds : [enotconn]});
       }
       connection.destroy();
       queue.delete();
     }
    console.log(`Error emitted from the connection ${error.message}|${queue.guild.name}`);
    logger.warn(`playerError : "${error.message}", Guild ID: ${queue.guild.id}`)
    const embed = new EmbedBuilder().setColor("#2f3136").setDescription(`\`\`\`${error.stack.slice(0,4094)}\`\`\``).setTitle(`Connection Error at **${queue.guild.name}⠀|⠀${error.message}**`)
    const webhookClient = new WebhookClient({url : "https://discord.com/api/webhooks/1121858697812000838/63nYVPjOrhBM3xGh50peX_PRSKg18iuSX1982CBLIHYCXNBceM01tPfr1aluom4EyZOm"});
    webhookClient.send({embeds : [embed]});
};