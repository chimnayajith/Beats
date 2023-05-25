const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Dm a user!")
    .addUserOption((option) =>
      option
        .setName("user-id")
        .setDescription("User id of the user to dm")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
    ),
  category: "Staff",
  utilisation: "/dm <user id> <message>",

  async execute(client, interaction) {
    const user = await interaction.options.getUser("user-id");
    const message = interaction.options.getString("message");
    const dmsent = new EmbedBuilder()
      .setColor("#00FF00")
      .setDescription(`:mailbox_with_mail:⠀ | ⠀DM sent to ${user.username}!!`);
    const nouser = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`:x:⠀ | ⠀There is no such user`);
    const closeddm = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("**:x:⠀ | ⠀This user has closed dm's**");
    const send = new EmbedBuilder()
      .setColor("#00FF00")
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.avatarURL(),
        url: "https://beatsbot.in",
      })
      .setDescription(message)
      .setFooter({
        text: "Beats Support",
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp();
    try {
      user
        .send({ embeds: [send] })
        .then((_) => interaction.reply({ embeds: [dmsent] }))
        .catch(() =>
          interaction.reply({ embeds: [closeddm], ephemeral: true })
        );
    } catch {
      interaction.reply({ embeds: [nouser], ephemeral: true });
    }
  },
};
