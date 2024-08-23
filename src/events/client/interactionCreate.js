const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("config");
const vote = require("../../common/utils/scripts/voteCheck");
const Patron = require("../../models/patrons");
const Command = require("../../models/commandSchema");
const logger = require("../../common/utils/other/logger");
const { getRestricted } = require("../../common/utils/scripts/restrictUtil");
const { isDjCommand } = require("../../common/utils/scripts/settingsUtil");
const embedOptions = config.get("embedOptions");
const botOptions = config.get("botOptions");

module.exports = async (client, interaction) => {
  // Handling autocomplete
  if (interaction.isAutocomplete()) {
    const cmd = await client.slashCommands.get(interaction.commandName);
    cmd.autocomplete(interaction);
  }

  // Embed to be sent in the DM of the user in case the interaction is created in DMs
  const dmEmbed = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Hey there!")
    .setDescription(
      `Commands do not work in the DM's.We kindly request that you join our support server using the button provided below for any assistance or inquiries regarding the bot. This support server serves as the official channel to receive support, as well as stay updated with the latest updates and announcements related to the bot. Thank you for understanding.`,
    )
    .setThumbnail(botOptions.logoUrl);
  const supportButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL(botOptions.serverInviteUrl)
      .setLabel("Support Server")
      .setEmoji(`<:discord:901666981944655912>`)
      .setStyle(5),
  );
  if (interaction.channel.isDMBased())
    return interaction.reply({
      embeds: [dmEmbed],
      components: [supportButton],
    });

  if (interaction.isCommand()) {
    const joinVoice = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:microphone2:⠀ | ⠀Join a voice channel first!`);
    const differentVoice = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`,
      );

    const cmd = await client.slashCommands.get(interaction.commandName);

    const vote_restricted = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("<:premium:1136316275677732964>⠀|⠀Premium Feature")
      .setDescription(
        "<:beats_right:1133048273704337558> Get Beats Premium now : **[Premium](https://www.patreon.com/thebeats)**\n\nPremium subscribers get access to exclusive commands and help support our development.\n\nOr vote for us every 12 hours: [Vote Now](https://beatsbot.in/vote/dbl) ",
      )
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/939341316947603577/1136330613360697344/premium.png",
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Premium")
        .setURL("https://beatsbot.in/patreon")
        .setEmoji("<:patreon:956903191507763240>"),
    );

    const serverPremium = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(
        "<:premium:1136316275677732964>⠀|⠀Server Premium Exclusive Feature",
      )
      .setDescription(
        "<:beats_right:1133048273704337558> Get Beats Server Premium now : **[Premium](https://www.patreon.com/thebeats)**\n\nPremium subscribers get access to exclusive commands and help support our development.",
      )
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/939341316947603577/1136330613360697344/premium.png",
      );
    if (cmd && cmd.server_premium) {
      const patron = await Patron.findOne({ _id: "patrons" });
      const guild_plus = patron.server_plus;
      if (!guild_plus.includes(interaction.guild.ownerId))
        return interaction.reply({ embeds: [serverPremium], row: [row] });
    }

    // Vote Check
    if (cmd && cmd.vote) {
      const patron = await Patron.findOne({ _id: "patrons" });
      const user_plus = [...patron.donator, ...patron.user_plus];
      const guild_plus = patron.server_plus;
      patron: if (
        user_plus.includes(interaction.user.id) ||
        guild_plus.includes(interaction.guild.ownerId) ||
        guild_plus.includes(interaction.user.id)
      ) {
        break patron;
      } else {
        const voted = await vote.checkVoted(interaction.user.id);
        if (!voted)
          return interaction.reply({
            embeds: [vote_restricted],
            components: [row],
            ephemeral: true,
          });
      }
    }

    //DJ role and command check
    const isDJ = await isDjCommand(
      interaction.guild.id,
      interaction.commandName,
    );
    const patron = await Patron.findOne({ _id: "patrons" });
    const guild_plus = patron.server_plus;

    if (isDJ.isEnabled && guild_plus.includes(interaction.guild.id)) {
      const djRestricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `${
            embedOptions.emojis.failed
          }⠀|⠀This is a DJ role **restricted** command!.\n\nYou need any of ${isDJ.roleID.map(
            (each) => `<@&${each}>`,
          )} roles to use this command.`,
        )
        .setTitle(`Restricted to DJ Roles`);
      if (
        !interaction.member.roles.cache.some((role) =>
          isDJ.roleID.includes(role.id),
        )
      ) {
        interaction.reply({ embeds: [djRestricted], ephemeral: true });
        return;
      }
    }

    //is Restricted
    const data = await getRestricted(interaction.guild.id, interaction.user.id);
    if (data) {
      const restricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `You have been restricted from using Beats commands. Use commands again <t:${Math.floor(
            data.expireAt.getTime() / 1000,
          )}:R>`,
        )
        .setTitle("Restricted")
        .addFields(
          {
            name: "<:beats_user:1133047309320593490> Restricted by:",
            value: `<@${data.moderator}>`,
            inline: true,
          },
          {
            name: `<:beats_right:1133048273704337558> Reason:`,
            value: `\`${data.reason}\``,
            inline: true,
          },
        );
      return interaction.reply({ embeds: [restricted] });
    }

    // Voice channel command or not?
    if (cmd && cmd.voiceChannel) {
      if (!interaction.member.voice.channel)
        return interaction.reply({ embeds: [joinVoice], ephemeral: true });

      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      )
        return interaction.reply({ embeds: [differentVoice], ephemeral: true });
    }

    if (cmd) {
      if (interaction.commandName == cmd.data.name) {
        cmd.execute(client, interaction);
        logger.info(
          `Command: ${cmd.data.name}, Guild ID: ${interaction.guild.id}, User ID: ${interaction.user.id}, Arguments: ${JSON.stringify(interaction.options._hoistedOptions)}`,
        );
        if (cmd.category != "Staff") {
          await Command.findOneAndUpdate(
            { _id: cmd.data.name },
            { $inc: { usageCount: 1 } },
            { upsert: true },
          );
        }
      }
    }
  }
};
