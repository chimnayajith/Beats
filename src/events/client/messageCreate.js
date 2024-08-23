const { EmbedBuilder, WebhookClient } = require("discord.js");
const config = require("config");
const botOptions = config.get("botOptions");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const webhookClient = new WebhookClient({
    id: "1118091168052420608",
    token:
      "mXyHxt8zu3-cNDar08PTGa52l-DyWOhGZUKmDWB0cs2BkoZgRdZOwIJ3RctVW8T8Trlq",
  });
  if (message.channel.isDMBased()) {
    const dmMessage = new EmbedBuilder()
      .setColor("#2f3136")
      .setAuthor({
        name: `${message.author.tag} (${message.author.id})`,
        iconURL: message.author.avatarURL(),
      })
      .setDescription(message.content)
      .setTimestamp();
    webhookClient.send({ embeds: [dmMessage] });
    return;
  }

  const slashCommandMigrated = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Hey there :wave:")
    .setDescription(
      `Beats uses slash commands.\n\nUse \`/help\` for list of my commands`,
    )
    .setThumbnail(botOptions.logoUrl);

  try {
    if (
      message.content.match(
        new RegExp(`^<@!?${client.user.id}>\\s*(prefix)?`, "i"),
      ) &&
      !message.content.includes("@everyone") &&
      !message.content.includes("@here")
    ) {
      message.reply({
        embeds: [slashCommandMigrated],
        allowedMentions: { repliedUser: false },
      });
    }
  } catch (e) {
    console.log(e);
  }
};
