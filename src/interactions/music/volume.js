const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const maxVol = 200;
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set volume of the track")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("Volume of track [1 - 200]")
        .setRequired(false)
    ),
  voiceChannel: true,
  vote : true,
  category: "Music",
  utilisation: "/volume <1-200>",

  async execute(client, interaction) {
    const volume = interaction.options.get("volume");

    const queue = player.nodes.get(interaction.guild.id);
    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);

    if (!queue) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const currentVolume = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle(`**:loud_sound: ⠀|⠀ Current volume :  ${queue.node.volume}%**`)
      .setDescription(
        `*To change the volume enter a valid number between **1** and **${maxVol}***`
      );
    if (!volume) {
      interaction.reply({ embeds: [currentVolume], ephemeral: true });
    } else {
      const vol = parseInt(volume.value);
      
      const alreadySet = new EmbedBuilder().setColor("#2f3136").setDescription(`:loud_sound: ⠀|⠀ Volume already set at **${queue.node.volume}**`);
      const invalidVolume = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x: ⠀|⠀ Enter a valid number between *1* and *200* **`);
      const volumeSuccess = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:tick:889018326255288360> ⠀|⠀ Volume set to **${vol}%**`);
      const errorEmbed = new EmbedBuilder().setColor("#2f3136").setDescription(`**:x: ⠀|⠀ Something went wrong..Try Again**`);

      if (queue.node.volume === vol)
        return interaction.reply({ embeds: [alreadySet], ephemeral: true });

      if (vol < 0 || vol > maxVol)
        return interaction.reply({ embeds: [invalidVolume], ephemeral: true });

      const success = queue.node.setVolume(vol);
      await logIfRequired(interaction.guild.id ,interaction.guild.ownerId, "controlLogs" , {
        guildName: interaction.guild.name,
        guildID: interaction.guild.id,
        guildIcon: interaction.guild.iconURL(),
        command : "volume",
        userID : interaction.user.id ,
        textChannel : interaction.channel.id
      });
      return interaction.reply(
        success ? { embeds: [volumeSuccess] } : { embeds: [errorEmbed], ephemeral: true }
      ).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
    }
  },
};
