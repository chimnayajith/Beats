const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Issue a maintenance for Beats"),

  voiceChannel: false,
  vote: false,
  category: "Admin",
  utilisation: "/maintenance",

  async execute(client, interaction) {
    const keys = Array.from(client.voice.adapters.keys());

    for (const serverId of keys) {   
        const queue = player.nodes.get(serverId);    
        if (!queue) { 
            const connection = await getVoiceConnection(serverId);
            connection.destroy();
        } else if (queue) {
            const maintenance = new EmbedBuilder().setColor("#2f3136").setDescription(`Beats is scheduled for a brief restart to implement important maintenance changes. During this time, your music queue will be interrupted. We apologize for any inconvenience caused. The restart will be completed as quickly as possible to ensure improved performance and new features.\n\nThank you for your understanding and continued support! <:beats:1115516004886388736>:blue_heart: `).setTitle('Restarting for Maintenance').setThumbnail('https://media.discordapp.net/attachments/889016433252634657/1056207020128219186/wdK4HwhYAAAAASUVORK5CYII.png');
            queue.metadata.interaction.channel.send({embeds : [maintenance]}) || queue.connection.channel({embeds : [maintenance]})
            const connection = await getVoiceConnection(serverId); 
            connection.destroy();
        }
    }
    interaction.reply({content: " Done!"})
  },
};