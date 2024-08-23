const { EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = async (data) => {
  const embed = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Ratelimited")
    .addFields([
      {
        name: "Timeout Duration",
        value: data.timeToReset.toString(),
        inline: true,
      },
      { name: "Max Limit", value: data.limit.toString(), inline: true },
      { name: "Method", value: data.method.toString(), inline: true },
      { name: "Path", value: data.majorParameter.toString(), inline: true },
      { name: "Route", value: data.route, inline: true },
      { name: "Global?", value: data.global.toString(), inline: true },
    ])
    .setTimestamp();

  const webhookClient = new WebhookClient({
    url: "https://discord.com/api/webhooks/1121858697812000838/63nYVPjOrhBM3xGh50peX_PRSKg18iuSX1982CBLIHYCXNBceM01tPfr1aluom4EyZOm",
  });
  webhookClient.send({ content: "<@&889559572510023791>", embeds: [embed] });
};
