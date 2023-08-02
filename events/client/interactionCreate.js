const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const vote = require("../../utils/scripts/voteCheck");
const Patron = require("../../models/patrons");
const Command = require("../../models/commandSchema");
const logger = require("../../utils/other/logger");
const { getRestricted } = require("../../utils/scripts/restrictUtil");
const { isDjCommand } = require("../../utils/scripts/settingsUtil");
const { embedOptions } = require("../../config");

module.exports = async (client, interaction) => {
  const dmEmbed = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("Hey there!")
    .setDescription(
      `Commands do not work in the DM's.We kindly request that you join our support server using the button provided below for any assistance or inquiries regarding the bot. This support server serves as the official channel to receive support, as well as stay updated with the latest updates and announcements related to the bot. Thank you for understanding.`
    )
    .setThumbnail("https://cdn.beatsbot.in/Beats.png");

  const supportButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL("https://discord.gg/JRRZmdFGmq")
      .setLabel("Support Server")
      .setEmoji(`<:discord:901666981944655912>`)
      .setStyle(5)
  );

  if (interaction.isAutocomplete()) {
    const cmd = await client.slashCommands.get(interaction.commandName);
    cmd.autocomplete(interaction);
  }
  if (interaction.channel.isDMBased())
    return interaction.reply({
      embeds: [dmEmbed],
      components: [supportButton],
    });
  if (interaction.isCommand()) {
    const embed1 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`:microphone2:⠀ | ⠀Join a voice channel first!`);
    const embed2 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(
        `<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`
      );

    const cmd = await client.slashCommands.get(interaction.commandName);

    const vote_restricted = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Vote Restricted")
      .setDescription(
        "This is a vote-restricted command. Please vote to use this command. You can also donate a small amount to bypass all vote-restricted commands for every month you donate."
      )
      .setThumbnail(
        "https://images-ext-1.discordapp.net/external/9oXThT38s-OREhVmAkDeMoUcsNSMTrDZKEWwdAMLIeI/https/cdn.discordapp.com/emojis/777587011497623572.png"
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Vote")
        .setURL("https://beatsbot.in/vote/dbl")
        .setEmoji("<a:vote:956901647043416104>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Donate")
        .setURL("https://beatsbot.in/patreon")
        .setEmoji("<:patreon:956903191507763240>")
    );

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
      interaction.commandName
    );
    if (isDJ.isEnabled) {
      const djRestricted = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `${
            embedOptions.emojis.failed
          }⠀|⠀This is a DJ role **restricted** command!.\n\nYou need any of ${isDJ.roleID.map(
            (each) => `<@&${each}>`
          )} roles to use this command.`
        )
        .setTitle(`Restricted to DJ Roles`);
      if (
        !interaction.member.roles.cache.some((role) =>
          isDJ.roleID.includes(role.id)
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
            data.expireAt.getTime() / 1000
          )}:R>`
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
          }
        );
      return interaction.reply({ embeds: [restricted] });
    }

    // Voice channel command or not?
    if (cmd && cmd.voiceChannel) {
      if (!interaction.member.voice.channel)
        return interaction.reply({ embeds: [embed1], ephemeral: true });

      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      )
        return interaction.reply({ embeds: [embed2], ephemeral: true });
    }

    // Execute the command!
    if (cmd) {
      if (interaction.commandName == cmd.data.name) {
        cmd.execute(client, interaction);
        logger.info(
          `Command: ${cmd.data.name}, Guild ID: ${
            interaction.guild.id
          }, User ID: ${interaction.user.id}, Arguments: ${JSON.stringify(
            interaction.options._hoistedOptions
          )}`
        );
        if (process.env.NODE_ENV !== "development") {
          if (cmd.category != "Staff") {
            await Command.findOneAndUpdate(
              { _id: cmd.data.name },
              { $inc: { usageCount: 1 } },
              { upsert: true }
            );
          }
        }
      }
    }
  }
};
