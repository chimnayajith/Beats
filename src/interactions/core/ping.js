const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Latency of the bot"),
  category: "Infos",
  utilisation: "/ping",

  async execute(client, interaction) {
    const embed = new EmbedBuilder();
    embed.setColor("#2f3136"),
      embed.addFields({
        name: `<:ping:889018163386281996> Pong!`,
        value: `\nThis message has a latency  **\`${client.ws.ping} ms\`**`,
      });
    embed.setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
