const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
const {
  checkRestricted,
  addRestriction,
  removeRestriction,
} = require("../../common/utils/scripts/restrictUtil");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restrict")
    .setDescription("Set/Remove restriction for using Beats commands!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subCommand) =>
      subCommand
        .setName("add")
        .setDescription("Add restriction for using Beats commands!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to add restriction")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration to restrict from using Beats commands!")
            .setRequired(true)
            .addChoices(
              { name: "60 seconds", value: `1 min` },
              { name: "5 minutes", value: `5 min` },
              { name: "10 minutes", value: `10 min` },
              { name: "1 hour", value: `1 hour` },
              { name: "1 day", value: `1 day` },
              { name: "1 week", value: `7 days` }
            )
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason the user is timeouted")
            .setRequired(false)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("remove")
        .setDescription("remove restriction from a restricted user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to remove restriction from")
            .setRequired(true)
        )
    ),
  voiceChannel: false,
  vote: true,
  category: "Info",
  utilisation:
    "/restrict add [user] [duration] <reason> or /restrict remove [user]",

  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "add") {
      const user = interaction.options.getUser("user");
      const durationoption = interaction.options.get("duration").value;
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";
      const duration = ms(durationoption);

      const restrictUser = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

      const notinguild = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription("** cUser not in this Server! **");
      if (!restrictUser)
        return interaction.reply({ embeds: [notinguild], ephemeral: true });

      const yourself = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:1131489226496671744>⠀|⠀You cannot restrict yourself!**"
        );
      if (restrictUser === interaction.member)
        return interaction.reply({ embeds: [yourself], ephemeral: true });

      const cannotRestrict = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:1131489226496671744>  ⠀|⠀Cannot rsestrict a user with a higher role than you!**"
        );
      if (
        restrictUser.roles.highest.comparePositionTo(
          interaction.member.roles.highest
        ) > 0
      )
        return interaction.reply({ embeds: [cannotRestrict], ephemeral: true });

      const check = await checkRestricted(interaction.guild.id, user.id);
      const alreadyRestricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:1131489226496671744>⠀|⠀User is already restricted!**"
        );
      if (check)
        return interaction.reply({
          embeds: [alreadyRestricted],
          ephemeral: true,
        });

      const confirmation = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Restriction Confirmation")
        .addFields(
          {
            name: "<:beats_user:1133047309320593490> Target:",
            value: `\`${restrictUser.user.username}\``,
          },
          {
            name: `<:beats_time:1133047303855423518> Duration:`,
            value: `\`${durationoption}\``,
          },
          {
            name: `<:beats_right:1133048273704337558> Reason:`,
            value: `\`${reason}\``,
          }
        );
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(3),
        new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(4)
      );
      const disabledrow = new ActionRowBuilder().addComponents(
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

      const msg = await interaction.reply({
        embeds: [confirmation],
        components: [row],
        fetchReply: true,
      });
      const success = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<:tick1:942463946219208754>⠀|⠀<@${user.id}> has been restricted from using Beats commands for \`${durationoption}\` by <@${interaction.user.id}>`
        );

      const collector = msg.createMessageComponentCollector({
        time: 30000,
        componentType: 2,
      });
      collector.on("collect", async (collected) => {
        const value = collected.customId;
        await collected.deferUpdate();
        if (collected.user.id !== interaction.user.id)
          return collected.followUp({
            content: `<:huh:897560243624640563>⠀|⠀That command wasnt for you `,
            ephemeral: true,
          });
        if (value === "confirm") {
          await addRestriction(
            interaction.guild.id,
            user.id,
            interaction.user.id,
            duration,
            reason
          );
          await logIfRequired(
            interaction.guild.id,
            interaction.guild.ownerId,
            "restrictLogs restrictUser",
            {
              guildName: interaction.guild.name,
              guildID: interaction.guild.id,
              guildIcon: interaction.guild.iconURL(),
              restrictedUserId : user.id,
              moderator : interaction.user.id,
              duration : durationoption , 
              reason : reason
            }
          );
          collected
            .editReply({ embeds: [success], components: [] })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000)
            );
        } else if (value === "cancel") {
          confirmation.setTitle("Restriction Cancelled");
          collected
            .editReply({
              embeds: [confirmation],
              components: [disabledrow],
              ephemeral: false,
            })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000)
            );
        }
      });

      collector.on("end", async (c, reason) => {
        if (reason === "time" && c.size === 0) {
          confirmation.setTitle("Restriction Cancelled");
          interaction
            .editReply({ embeds: [confirmation], components: [disabledrow] })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000)
            );
        }
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const user = interaction.options.getUser("user");
      const isUserRestricted = await checkRestricted(
        interaction.guild.id,
        user.id
      );

      const userNotRestricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<:failed:1131489226496671744>⠀|⠀User is not restricted!`
        );
      if (!isUserRestricted)
        return interaction.reply({
          embeds: [userNotRestricted],
          ephemeral: true,
        });

      removeRestriction(interaction.guild.id, user.id);
      await logIfRequired(
        interaction.guild.id,
        interaction.guild.ownerId,
        "restrictLogs unrestrictUser",
        {
          guildName: interaction.guild.name,
          guildID: interaction.guild.id,
          guildIcon: interaction.guild.iconURL(),
          restrictedUserId : user.id,
          moderator : interaction.user.id,
        }
      );
      const unRestricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<:tick1:942463946219208754>⠀|⠀Restriction for ${user} has been removed!`
        );
      interaction
        .reply({ embeds: [unRestricted] })
        .then((message) =>
          setTimeout(() => message.delete().catch(console.error), 20000)
        );
    }
  },
};
