const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const os = require("os");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();
const packageJson = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Bot Statistics"),
  category: "Staff",
  utilisation: "/stats",

  async execute(client, interaction) {
    const promises = [
      client.shard.fetchClientValues("guilds.cache.size"),
      client.shard.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      ),
      client.shard.fetchClientValues("voice.adapters.size"),
      client.shard.fetchClientValues("ws.ping"),
      client.shard.broadcastEval(() => player.generateStatistics().queues),
    ];

    Promise.all(promises)
      .then((results) => {
        const totalGuilds = results[0].reduce(
          (acc, guildCount) => acc + guildCount,
          0,
        );
        const totalMembers = results[1].reduce(
          (acc, memberCount) => acc + memberCount,
          0,
        );
        const totalVoice = results[2].reduce((a, b) => a + b, 0);
        const totalListeners = results[4]
          .flat()
          .reduce((acc, item) => acc + item.listeners, 0);
        const totalQueueTracks = results[4]
          .flat()
          .reduce((acc, item) => acc + item.tracksCount, 0);

        const duration = durationFormatter.format(client.uptime, `1`);
        const stats = codeBlock(
          "asciidoc",
          `
• Cores          ::     ${os.cpus().length}         
• Beats          ::     v${packageJson.version}
• Discord.js     ::     v${version}
• Node           ::     ${process.version}`,
        );
        const statsEmbed = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("<:stats:889018165357576264> • Beats Statistics")
          .addFields(
            {
              name: "Server count",
              value: `\`\`\`yaml\n${totalGuilds}\`\`\``,
              inline: true,
            },
            {
              name: "Total Users",
              value: `\`\`\`yaml\n${totalMembers}\`\`\``,
              inline: true,
            },
            {
              name: "Active Voice Channels",
              value: `\`\`\`yaml\n${totalVoice}\`\`\``,
              inline: true,
            },
            {
              name: "Listeners",
              value: `\`\`\`yaml\n${totalListeners}⠀\`\`\``,
              inline: true,
            },
            {
              name: "Tracks Queued",
              value: `\`\`\`yaml\n${totalQueueTracks}\`\`\``,
              inline: true,
            },
            {
              name: "Uptime",
              value: `\`\`\`yaml\n${duration}\`\`\``,
              inline: true,
            },
          );
        if (
          interaction.member.id === "746568635115634759" ||
          interaction.member.id === "891581154765979668"
        ) {
          statsEmbed.addFields({ name: "More", value: stats });
        }
        interaction.reply({ embeds: [statsEmbed] });
      })
      .catch(console.error);
  },
};
