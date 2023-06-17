const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect from voice channel"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/disconnect",

  async execute(client, interaction) {
    const connection = getVoiceConnection(interaction.member.voice.guild.id);
    
    const queue = player.nodes.get(interaction.guild.id);
    embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:tick:889018326255288360>⠀ | ⠀Beats has been \`disconnected\`.`
      );
      connection.destroy();
      interaction.reply({ embeds: [embed] }).then((message) => setTimeout(() => message.delete(), 20000));
    // if (queue) {
    //   try {
    //     queue.node.pause();
    //     queue.delete();
    //     interaction.reply({ embeds: [embed] }).then((message) => setTimeout(() => message.delete(), 20000));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else {
    //   connection.destroy();
    //   interaction.reply({ embeds: [embed] }).then((message) => setTimeout(() => message.delete(), 20000));
    // }
  },
};
