const { EmbedBuilder } = require("discord.js");
module.exports = async (client, guild) => {
  let ownerTag = await guild.fetchOwner().then((owner) => owner.user.tag);
  let name = guild.name;
  let count = guild.memberCount;
  let id = guild.id;

  const bot = await guild.members.cache.filter((m) => m.user.bot).size;
  const human = guild.members.cache.filter((member) => !member.user.bot).size;
  const ratio = human / bot;
  const leaveguild = new EmbedBuilder()
    .setColor("Random")
    .setTitle("UH OH! REMOVED FROM SERVER")
    .setDescription(`**Beats** has been removed from server\n\n`)
    .setThumbnail(
      "https://images-ext-2.discordapp.net/external/sPSe9EULw3KTeFGwtmlW60dtwcFQ5UVTDGgu_s8fqvo/https/media.discordapp.net/attachments/889016433252634657/889722837391257610/sad.gif"
    )
    .addFields(
      { name: `Name `, value: `\`\`\`yaml\n${name}\`\`\``, inline: true },
      {
        name: `Member Count `,
        value: `\`\`\`yaml\n${count}\`\`\``,
        inline: true,
      },
      { name: `\u200B`, value: "\u200B", inline: true },
      { name: `Owner `, value: `\`\`\`yaml\n${ownerTag}\`\`\``, inline: true },
      { name: `Guild ID `, value: `\`\`\`yaml\n${id}\`\`\``, inline: true },
      { name: `\u200B`, value: "\u200B", inline: true }
    );
      
  client.shard.broadcastEval(async (c) => {
    const promises = [
      client.shard.fetchClientValues("guilds.cache.size"),
      client.shard.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];

    Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      const totalMembers = results[1].reduce(
        (acc, memberCount) => acc + memberCount,
        0
      );

      const servercount = c.channels.cache.get("889694415310962739");
      servercount?.setName(`Server Count: ${totalGuilds}`);
      const usercount = c.channels.cache.get("889695060965355550");
      usercount?.setName(`Users : ${totalMembers}`);
    });
  });

  client.shard.broadcastEval(
    async (c, { e }) => {
      c.channels.cache.get("895529189619425320")?.send({ embeds: [e] });
    },
    { context: { e: leaveguild } }
  );
};
