const {EmbedBuilder , WebhookClient} =require("discord.js")
module.exports = async (client, user , message ,id) => {

const newReport = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("New Report")
    .setAuthor({iconURL : user.avatarURL(),name : `${user.tag} (${user.id})` })
    .setDescription(`${message}\n\n[Click here](https://admin.beatsbot.in/reports/${id})`)
    .setThumbnail('https://cdn.beatsbot.in/Beats.png')

    const webhookClient = new WebhookClient({url : "https://discord.com/api/webhooks/1124816167861751828/KIjR_ic0kMo4StMl-iuzyHXrSPwcIzXVSFoyKu8Oo0Ti2qUDcmj9Iie2bGwOFCAxKwkD"});
    webhookClient.send({content : '<@&890103815121043466>' , embeds : [newReport]});

}