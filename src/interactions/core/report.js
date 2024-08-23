const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const report = require("../../common/utils/scripts/reportAdd");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription(
      "Report an issue or suggest a new feature to Beats Developers.",
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Type in your message to send!")
        .setRequired(true),
    ),
  category: "Infos",
  utilisation: "/report [message]",

  async execute(client, interaction) {
    const message = interaction.options.get("message").value;

    const confirmation = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Report Confirmation")
      .setThumbnail(
        interaction.user.displayAvatarURL() ||
          "https://media.discordapp.net/attachments/984800721792794675/985044566518431775/unknown.png",
      )
      .setDescription(
        `**${interaction.user.tag}**\n\nReport : \`\`\`${message}\`\`\`\n\nAre you sure you want to send this report?`,
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(3),
      new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(4),
    );
    const msg = await interaction.reply({
      embeds: [confirmation],
      components: [row],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      time: 30000,
      componentType: 2,
    });

    const confirmed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Report Sent")
      .setThumbnail("https://cdn.beatsbot.in/Beats.png")
      .setDescription(
        "Your report has been sent to Beats Developers. We'll try our best to resolve the issue",
      );
    const cancelled = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Cancelled")
      .setDescription("The report has been cancelled.");

    collector.on("collect", async (collected) => {
      const value = collected.customId;
      await collected.deferUpdate();

      if (collected.user.id !== interaction.user.id)
        return collected.followUp({
          content: `:x:  |  That command wasnt for you `,
          ephemeral: true,
        });

      if (value === "confirm") {
        await report.addReport(interaction.user, message);
        collected.editReply({ embeds: [confirmed], components: [] });
      } else if (value === "cancel") {
        collected
          .editReply({ embeds: [cancelled], components: [] })
          .then((message) => setTimeout(() => message.delete(), 5000));
      }
    });
    collector.on("end", (collected, error) => {
      if (error === "time") {
        interaction.deleteReply();
      }
    });
  },
};
