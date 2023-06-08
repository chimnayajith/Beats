const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
module.exports = async (client, guild) => {
  let ownerTag = await guild.fetchOwner().then((owner) => owner.user.tag);
  let name = guild.name;
  let count = guild.memberCount;
  let id = guild.id;

  const newGuild1 = new EmbedBuilder()
    .setColor("Random")
    .setTitle("YAYY!! NEW SERVER")
    .setDescription(`**Beats** has been added to a new server\n\n`)
    .setThumbnail(`https://cdn.beatsbot.in/attachments/tadaa.gif`)
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
    
  const newGuild = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("<a:tadaa:889117417811378218> Thanks for adding Beats!")
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
    .setThumbnail("https://cdn.beatsbot.in/Beats.png")
    .setDescription(
    `Unleash the rhythm and elevate your Discord server with Beats, the ultimate music bot that brings harmony, energy, and a symphony of melodies to your online community.\n\nBeats uses slash commands.You can get started by using /help. **[Website](https://beatsbot.in)**  |  **[Commands](https://dashboard.beatsbot.in/commands)**  | **[Blog](https://blog.beatsbot.in/))**  |  **[Support Server](https://discord.gg/JRRZmdFGmq)**\n\n**Enjoy Music with Beats!!<:beats:1115516004886388736>**`
    );

  const embeds = [newGuild1, newGuild];

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
    async (c, { g, e }) => {
async function getDefaultChannel(guild) {

    guild.channels.find((channel) => {
      const permissions = channel.permissionsFor(guild.members.me);
      return (
        permissions && permissions.has(PermissionFlagsBits.SendMessages) && channel.type === ChannelType.GuildText
      );
    }) || null
}

      const guild = await g;
      const consol = c.channels.cache.get("899704750554112021");
      const name = guild?.name;
      const channel = await guild?.systemChannel || await getDefaultChannel(guild);
      if (!channel)
        return consol?.send(`No channel to welcome in **${await g.name}**`);

      await c.channels.cache.get("895528930281410602") ?.send({ embeds: [e[0]] });

        channel
          .send({ embeds: [e[1]] })
          .catch((err) =>
            consol?.send(
              `Couldn't send welcome message to **${name}**\n ${err}`
            )
          );
      
    },
    { context: { g: guild, e: embeds } }
  );


};


