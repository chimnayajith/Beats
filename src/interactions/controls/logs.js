const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const {
  logUpdate,
  checkExistingLogs,
} = require("../../common/utils/scripts/settingsUtil");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Logging for Beats activities")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subCommand) =>
      subCommand
        .setName("set")
        .setDescription("Set a logging channel for Beats")
        .addChannelOption((option) =>
          option
            .addChannelTypes(...[ChannelType.GuildText])
            .setName("log-channel")
            .setDescription("Channel to send the logs to!")
            .setRequired(true)
        )
    ),
  // vote : true , 
  server_premium : true,
  category: "Info",
  utilisation: "/logs set [channel]",

  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "set") {
      const channel = interaction.options.getChannel("log-channel");

      // Check for required permissions
      const requiredPermissions = [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.EmbedLinks,
      ];
      if (
        !interaction.guild.members.me
          .permissionsIn(channel)
          .has(requiredPermissions)
      ) {
        const noPermissions = new EmbedBuilder()
          .setColor("#2f3136")
          .setDescription(
            `<:failed:1131489226496671744>⠀|⠀Beats doesn't have all/some of these permissions : \`Send Messages\`, \`View Channel\`, \`Embed Links\` in channel`
          );
        return interaction.reply({ embeds: [noPermissions] , ephemeral : true});
      }

      const check = await checkExistingLogs(interaction.guild.id);

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(3),
        new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(4)
      );

      const disabledConfirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(3)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("Cancel")
          .setStyle(4)
          .setDisabled(true)
      );
      const logConfirmationEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<:channel:1134496554321977396> Channel : ${channel}\n\n${
            check.doesExist
              ? `Currently, your server has already setup logging to <#${
                  check.currentLogData.logChannelId
                }> and is ${check.isEnabled ? "" : `\`not\``} Enabled!`
              : `Following actions will be logged by default: \n- Song Playback Logging\n- Server Playlists Update\n- Restrict Logs\n- DJ System Update\n- Audio Control Commands [\`volume\`, \`skip\`, \`seek\`, \`disconnect\`, \`remove\`, \`removedupes\`, \`clear-queue\`, \`shuffle\`, \`pause\`, \`resume\`, \`previous\`, \`jump\`, \`autoplay\`, \`loop\`]`
          }\n\nTo modify the logged information in the log channel, please access the **[server dashboard](https://dashboard.beatsbot.in/servers/${
            interaction.guild.id
          }/settings)**\n\nAre you sure you want to update log settings?`
        )
        .setTitle("Log Channel Configuration");

      const successEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(`Beats activities will now be logged to ${channel}\n\n*Please note that Logging only applies to servers with an active Server Premium Plan*`)
        .setTitle(`Setup Successful`);

      const msg = await interaction.reply({
        embeds: [logConfirmationEmbed],
        components: [confirmRow],
        fetchReply: true,
      });

      const collector = msg.createMessageComponentCollector({
        time: 30000,
        componentType: 2,
      });

      collector.on("collect", async (collected) => {
        const value = collected.customId;
        await collected.deferUpdate();
        if (collected.user.id !== interaction.user.id)
          return collected.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("#2f3136")
                .setDescription(
                  `<:huh:897560243624640563>⠀|⠀That command wasnt for you`
                ),
            ],
            ephemeral: true,
          });
        if (value === "confirm") {
          await logUpdate(interaction.guild.id, channel.id);
          collected.editReply({ embeds: [successEmbed], components: [] });
        } else if (value === "cancel") {
          logConfirmationEmbed.setTitle("Setup Cancelled");
          collected.editReply({
            embeds: [logConfirmationEmbed],
            components: [disabledConfirmRow],
            ephemeral: false,
          });
        }
      });

      collector.on("end", async (c, reason) => {
        if (reason === "time" && c.size === 0) {
          logConfirmationEmbed.setTitle("Setup Cancelled");
          interaction
            .editReply({
              embeds: [logConfirmationEmbed],
              components: [disabledConfirmRow],
            })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000)
            );
        }
      });
    }
  },
};
