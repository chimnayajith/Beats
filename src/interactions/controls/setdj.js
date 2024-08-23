const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  djUpdate,
  checkExistingDJ,
  djAddRole,
  djRemoveRole,
  logIfRequired,
} = require("../../common/utils/scripts/settingsUtil");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setdj")
    .setDescription("Set DJ Roles for using DJ Commands!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role that can use DJ commands in the server")
        .setRequired(true),
    ),

  voiceChannel: false,
  // vote: true,
  server_premium: true,
  category: "Info",
  utilisation: "/setdj [role]",

  async execute(client, interaction) {
    const role = interaction.options.getRole("role");

    const data = await checkExistingDJ(interaction.guild.id, role.id);

    if (!data.doesExist) {
      const djSetup = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `DJ Commands that are set can only be used by users who have the role set as DJ : ${role}.\n\nAre you sure you want to continue?`,
        )
        .setTitle("DJ System Configuration");
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(3),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("Cancel")
          .setStyle(4),
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
          .setDisabled(true),
      );

      const success = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `${role} is now set as DJ role.\n\nBy default following commands are set to DJ : \`volume\`, \`skip\`, \`seek\`, \`disconnect\`, \`remove\`, \`removedupes\`, \`clear-queue\`, \`shuffle\`, \`pause\`, \`resume\`, \`previous\`, \`jump\`, \`autoplay\`, \`loop\`.\n\nTo customize the list of DJ commands, kindly navigate to the **[server dashboard](https://dashboard.beatsbot.in/servers/${interaction.guild.id}/settings)** and modify the DJ commands section.\n\n*Please note that DJ command restrictions only applies to servers with an active Server Premium Plan*`,
        )
        .setTitle("DJ Setup Successfull");

      const msg = await interaction.reply({
        embeds: [djSetup],
        components: [row],
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
                  `<:huh:897560243624640563>⠀|⠀That command wasnt for you`,
                ),
            ],
            ephemeral: true,
          });
        if (value === "confirm") {
          await djUpdate(interaction.guild.id, role.id);
          await logIfRequired(
            interaction.guild.id,
            interaction.guild.ownerId,
            "djSettingsUpdateLogs addRole",
            {
              guildName: interaction.guild.name,
              guildIcon: interaction.guild.iconURL(),
              guildID: interaction.guild.id,
              djRole: role.id,
              userID: interaction.user.id,
            },
          );
          collected.editReply({ embeds: [success], components: [] });
        } else if (value === "cancel") {
          djSetup.setTitle("Setup Cancelled");
          collected
            .editReply({
              embeds: [djSetup],
              components: [disabledrow],
              ephemeral: false,
            })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000),
            );
        }
      });
      collector.on("end", async (c, reason) => {
        if (reason === "time" && c.size === 0) {
          djSetup.setTitle("Setup Cancelled");
          interaction
            .editReply({ embeds: [djSetup], components: [disabledrow] })
            .then((message) =>
              setTimeout(() => message.delete().catch(console.error), 20000),
            );
        }
      });
    } else {
      if (!data.isRoleInArray) {
        if (data.isEnabled) {
          const djSetup = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `DJ Commands that are set can only be used by users who have the role set as DJ : ${role}.\n\nAre you sure you want to add ${role} as DJ role and continue?`,
            )
            .setTitle("DJ System Configuration");
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("confirm")
              .setLabel("Confirm")
              .setStyle(3),
            new ButtonBuilder()
              .setCustomId("cancel")
              .setLabel("Cancel")
              .setStyle(4),
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
              .setDisabled(true),
          );

          const success = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `${role} is now set as DJ role.\n\nKindly navigate to the **[server dashboard](https://dashboard.beatsbot.in/servers/${interaction.guild.id}/settings)** and modify the DJ commands section.`,
            )
            .setTitle("DJ Configuration Successfull");

          const msg = await interaction.reply({
            embeds: [djSetup],
            components: [row],
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
                      `<:huh:897560243624640563>⠀|⠀That command wasnt for you`,
                    ),
                ],
                ephemeral: true,
              });
            if (value === "confirm") {
              await djAddRole(interaction.guild.id, role.id);
              await logIfRequired(
                interaction.guild.id,
                interaction.guild.ownerId,
                "djSettingsUpdateLogs addRole",
                {
                  guildName: interaction.guild.name,
                  guildIcon: interaction.guild.iconURL(),
                  guildID: interaction.guild.id,
                  djRole: role.id,
                  userID: interaction.user.id,
                },
              );
              collected.editReply({ embeds: [success], components: [] });
            } else if (value === "cancel") {
              djSetup.setTitle("Setup Cancelled");
              collected
                .editReply({
                  embeds: [djSetup],
                  components: [disabledrow],
                  ephemeral: false,
                })
                .then((message) =>
                  setTimeout(
                    () => message.delete().catch(console.error),
                    20000,
                  ),
                );
            }
          });
          collector.on("end", async (c, reason) => {
            if (reason === "time" && c.size === 0) {
              djSetup.setTitle("Setup Cancelled");
              interaction
                .editReply({ embeds: [djSetup], components: [disabledrow] })
                .then((message) =>
                  setTimeout(
                    () => message.delete().catch(console.error),
                    20000,
                  ),
                );
            }
          });
        } else {
          const djSetup = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `DJ Commands that are set can only be used by users who have the role set as DJ : ${role}. Currently DJ System is \`Disabled\`.\n\nAre you sure you want to add ${role} as DJ role and Enable the DJ System?`,
            )
            .setTitle("DJ System Configuration");
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("confirm")
              .setLabel("Confirm")
              .setStyle(3),
            new ButtonBuilder()
              .setCustomId("cancel")
              .setLabel("Cancel")
              .setStyle(4),
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
              .setDisabled(true),
          );

          const success = new EmbedBuilder()
            .setColor("#2f3136")
            .setDescription(
              `${role} is now set as DJ role.\n\nKindly navigate to the **[server dashboard](https://dashboard.beatsbot.in/servers/${interaction.guild.id}/settings)** and modify the DJ commands section.`,
            )
            .setTitle("DJ Configuration Successfull");

          const msg = await interaction.reply({
            embeds: [djSetup],
            components: [row],
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
                      `<:huh:897560243624640563>⠀|⠀That command wasnt for you`,
                    ),
                ],
                ephemeral: true,
              });
            if (value === "confirm") {
              await djAddRole(interaction.guild.id, role.id);
              await logIfRequired(
                interaction.guild.id,
                interaction.guild.ownerId,
                "djSettingsUpdateLogs addRole",
                {
                  guildName: interaction.guild.name,
                  guildIcon: interaction.guild.iconURL(),
                  guildID: interaction.guild.id,
                  djRole: role.id,
                  userID: interaction.user.id,
                },
              );
              collected.editReply({ embeds: [success], components: [] });
            } else if (value === "cancel") {
              djSetup.setTitle("Setup Cancelled");
              collected
                .editReply({
                  embeds: [djSetup],
                  components: [disabledrow],
                  ephemeral: false,
                })
                .then((message) =>
                  setTimeout(
                    () => message.delete().catch(console.error),
                    20000,
                  ),
                );
            }
          });
          collector.on("end", async (c, reason) => {
            if (reason === "time" && c.size === 0) {
              djSetup.setTitle("Setup Cancelled");
              interaction
                .editReply({ embeds: [djSetup], components: [disabledrow] })
                .then((message) =>
                  setTimeout(
                    () => message.delete().catch(console.error),
                    20000,
                  ),
                );
            }
          });
        }
      } else {
        //remove role id
        const djSetup = new EmbedBuilder()
          .setColor("#2f3136")
          .setDescription(
            `${role} is already set as a DJ Role.\n\nAre you sure you want to remove ${role} from DJ roles and continue?`,
          )
          .setTitle("DJ System Configuration");
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm")
            .setStyle(3),
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(4),
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
            .setDisabled(true),
        );

        const success = new EmbedBuilder()
          .setColor("#2f3136")
          .setDescription(
            `${role} is now removed as DJ role. DJ system is ${
              data.isEnabled ? `\`Enabled\`` : `\`Disabled\``
            }\n\nKindly navigate to the **[server dashboard](https://dashboard.beatsbot.in/servers/${
              interaction.guild.id
            }/settings)** and modify the DJ commands section.`,
          )
          .setTitle("DJ Configuration Successfull");

        const msg = await interaction.reply({
          embeds: [djSetup],
          components: [row],
          fetchReply: true,
        });
        const collector = msg.createMessageComponentCollector({
          time: 5000,
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
                    `<:huh:897560243624640563>⠀|⠀That command wasn't for you`,
                  ),
              ],
              ephemeral: true,
            });
          if (value === "confirm") {
            await djRemoveRole(interaction.guild.id, role.id);
            await logIfRequired(
              interaction.guild.id,
              interaction.guild.ownerId,
              "djSettingsUpdateLogs removeRole",
              {
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL(),
                guildID: interaction.guild.id,
                djRole: role.id,
                userID: interaction.user.id,
              },
            );
            collected.editReply({ embeds: [success], components: [] });
          } else if (value === "cancel") {
            djSetup.setTitle("Setup Cancelled");
            collected
              .editReply({
                embeds: [djSetup],
                components: [disabledrow],
                ephemeral: false,
              })
              .then((message) =>
                setTimeout(() => message.delete().catch(console.error), 20000),
              );
          }
        });
        collector.on("end", async (c, reason) => {
          if (reason === "time" && c.size === 0) {
            console.log(c.size);
            djSetup.setTitle("Setup Cancelled");
            interaction
              .editReply({ embeds: [djSetup], components: [disabledrow] })
              .then((message) =>
                setTimeout(() => message.delete().catch(console.error), 20000),
              );
          }
        });
      }
    }
  },
};
