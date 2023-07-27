const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop current song or queue")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Current song / Queue")
        .addChoices(
          { name: "Off", value: "off" },
          { name: "Track", value: "track" },
          { name: "Queue", value: "queue" },
        )
        .setRequired(true)
    ),
  voiceChannel: true,
  category: "Music",
  utilisation: "/loop [off/track/queue]",

  async execute(client, interaction) {
    const input = interaction.options.get("option").value;

    const queue = player.nodes.get(interaction.guild.id);

    const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`**:mute: ⠀|⠀ No music currently playing**`);
    const noLoops = new EmbedBuilder().setColor("#2f3136").setDescription(":x:⠀|⠀No loops to disable");
    const trackLooped = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Current Track : Loop mode **enabled**");
    const trackUnlooped = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Current Track : Loop mode **disabled**");
    const queueLooped = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Queue : Loop mode **enabled**");
    const queueUnlooped = new EmbedBuilder().setColor("#2f3136").setDescription("<a:onoff:889018175721717781>⠀|⠀Queue : Loop mode **disabled**");
    const errorEmbed = new EmbedBuilder().setColor("#2f3136").setDescription("<a:warn:889018313143894046>⠀|⠀Something went wrong.Try again");

    if (!queue) return interaction.reply({ embeds: [noMusic] , ephemeral:true});

    if (input === "off") {
      if (queue.repeatMode !== 0) {
        if (queue.repeatMode === 1) {
          queue.setRepeatMode(0);
          interaction.reply({ embeds: [trackUnlooped] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
        }
        if (queue.repeatMode === 2) {
          queue.setRepeatMode(0);
          interaction.reply({ embeds: [queueUnlooped] }).then((message) => setTimeout(() => message.delete().catch(console.error), 20000));
        }
      } else {
        interaction.reply({ embeds: [noLoops], ephemeral: true });
      }
    }


    if ( input === 'track') {
      queue.setRepeatMode(1);
      interaction.reply({ embeds : [trackLooped]});
    } else if ( input === 'queue'){
      queue.setRepeatMode(2);
      interaction.reply({ embeds : [queueLooped]});
    } 
  },
};
