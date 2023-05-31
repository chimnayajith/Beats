const {EmbedBuilder} =require("discord.js")
module.exports = async (client, user , message ,id) => {
const channelId = '1112630149297483917';

const newreport = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("New Report")
    .setAuthor({iconURL : user.avatarURL(),name : `${user.tag} (${user.id})` })
    .setDescription(`${message}\n\nClickhttps://admin.beatsbot.in/reports/${id}`)
    .setThumbnail('https://cdn.beatsbot.in/Beats.png')

client.shard.broadcastEval(async(client, targetChannelId, messageContent) => {
  client.channels.fetch(targetChannelId.targetChannelId).then((channel)=>{
    channel.send({content : '<@&890103815121043466>',embeds : [targetChannelId.messageContent]});
  }) 
}, { context: { targetChannelId: channelId, messageContent: newreport } });

}