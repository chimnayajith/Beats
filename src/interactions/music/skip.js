const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip currently playing song"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/skip ",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);

    const no_music = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const no_next = new EmbedBuilder().setColor("#2f3136").setDescription(`**<a:warn:889018313143894046> ⠀|⠀ No song to play next**`);
    const skipped = new EmbedBuilder().setColor("#2f3136").setDescription(`**<:right:905743975607046145> ⠀|⠀ Current song skipped!**`);
    const error = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x: ⠀|⠀ Something went wrong..Try Again**`);

    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [no_music], ephemeral: true });
    const disconnected = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360>⠀ | ⠀Queue Empty. Beats has been \`disconnected\`.`);
    if (!queue.tracks.toArray()[0]) {
      queue.delete();
      interaction.reply({ embeds: [disconnected]  })
      return;
    }

    const success = queue.node.skip();  
    await logIfRequired(interaction.guild.id ,interaction.guild.ownerId, "controlLogs" , {
      guildName: interaction.guild.name,
      guildID: interaction.guild.id,
      guildIcon: interaction.guild.iconURL(),
      command : "skip",
      userID : interaction.user.id ,
      textChannel : interaction.channel.id
    });
    return interaction.reply(
      success ? { embeds: [skipped] } : { embeds: [error], ephemeral: true }
    ).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
  },
};
