const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Apply audio filters")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("Audio Filter")
        .setRequired(true)
        .addChoices(
          { name: "Bassboost", value: "bassboost" },
          { name: "8D", value: "8D" },
          { name: "Vaporwave", value: "vaporwave" },
          { name: "Nightcore", value: "nightcore" },
          { name: "Phaser", value: "phaser" },
          { name: "Tremolo", value: "tremolo" },
          { name: "Reverse", value: "reverse" },
          { name: "Treble", value: "treble" },
          { name: "Normalizer", value: "normalizer" },
          { name: "Surrounding", value: "surrounding" },
          { name: "Pulsator", value: "pulsator" },
          { name: "Subboost", value: "subboost" },
          { name: "Karaoke", value: "karaoke" },
          { name: "Flanger", value: "flanger" },
          { name: "Gate", value: "gate" },
          { name: "Chorus", value: "chorus" },
          { name: "Compressor", value: "compressor" },
          { name: "Softlimiter", value: "softlimiter" },
          { name: "Mstlr", value: "mstlr" },
          { name: "Mcompand", value: "mcompand" },
          { name: "Fade in", value: "fadein" },
          { name: "Vibrato", value: "vibrato" }
        )
    ),
  category: "Music",
  vote: true,
  utilisation: "/filter <filter name>",

  async execute(client, interaction) {
    const input = interaction.options.get("filter").value;
    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute:⠀ | ⠀No music currently playing**`);
    if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });

    const enableFilter = new EmbedBuilder().setColor("#2f3136").setDescription(`**:musical_note:⠀ |⠀ Enabling filter ${input.charAt(0).toUpperCase() + input.slice(1)}.Please Wait**`);
    const disableFilter = new EmbedBuilder().setColor("#2f3136").setDescription(`**:musical_note:⠀ |⠀ Disabling filter ${input.charAt(0).toUpperCase() + input.slice(1)}.Please Wait**`);
    await interaction.deferReply()

    if(queue.filters.ffmpeg.isEnabled(input)){
      await queue.filters.ffmpeg.setFilters(false)
      interaction.editReply({embeds : [disableFilter]}).then((message) => setTimeout(() => message.delete(), 20000));
    } else {
      await queue.filters.ffmpeg.setFilters([input])
      interaction.editReply({embeds : [enableFilter]})
    }
  },
};
