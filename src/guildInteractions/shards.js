const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shards")
    .setDescription("Shard Data!"),
  category: "Staff",
  utilisation: "/stats",

  async execute(client, interaction) {
    client.shard
      .broadcastEval((client) => [
        client.shard.ids,
        client.ws.status,
        client.ws.ping,
        client.guilds.cache.size,
        client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      ])
      .then((results) => {
        const status = [
          "READY",
          "CONNECTING",
          "RECONNECTING",
          "IDLE",
          "NEARLY",
          "DISCONNECTED",
          "WAITING_FOR_GUILDS",
          "IDENTIFYING",
          "RESUMING",
        ];
        const embed = new EmbedBuilder()
          .setTitle(` Bot Shards (${client.shard.count})`)
          .setColor("#ccd6dd")
          .setTimestamp();

        results.map((data) => {
          embed.addFields({
            name: `📡 Shard ${data[0]}`,
            value: `**<:greendot:889018164694904872> Status:** ${
              status[data[1]]
            }\n**<:ping:889018163386281996> Ping:** ${
              data[2]
            }ms\n**<:queue:889018313353601084> Guilds:** ${
              data[3]
            }\n**👥 Members:** ${data[4]}`,
          });
        });
        interaction.reply({ embeds: [embed] });
      })
      .catch((error) => {
        console.error(error);
        interaction.reply(`❌ Error.`);
      });
  },
};
