const { EmbedBuilder } = require("discord.js");
module.exports = async (client, guild) => {
  let ownerTag = await guild.fetchOwner().then((owner) => owner.user.tag);
  let name = guild.name;
  let count = guild.memberCount;
  let id = guild.id;

  const bot = await guild?.members
    .fetch()
    .then((mem) => mem.filter((m) => m.user.bot).size);
  const human = guild?.members.cache.filter((member) => !member.user.bot).size;
  const ratio = bot / human;

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
    .setThumbnail("https://cdn.beatsbot.in/Beats_main.png")
    .setDescription(
      `Beats, the perfect music bot for your server. Beats brings to your servers all premium features free of cost.\n\n• YouTube • SoundCloud • Spotify • Live Stream • 20+ Audio Filters  •  Custom Playlist  •  Autoplay  • Supports 250+ platforms  •  And much more... \nVisit our website for more : https://beatsbot.in \n\nBeats uses slash commands.You can get started by using /help. Check out our commands **[here](https://beatsbot.in/commands)**\n\n**Enjoy Music with Beats!!<:beats:907954300414734366> **`
    );

  const notenoughmembers = new EmbedBuilder()
    .setTitle("<a:settings1:889018323491254302> System Message")
    .setDescription("Beats has left the server as it has less than 5 members");

  const morebotsembed = new EmbedBuilder()
    .setTitle("<a:settings1:889018323491254302> System Message")
    .setDescription(
      "Beats has left the server as number of bots are more than humans."
    );

  const embeds = [newGuild1, newGuild, notenoughmembers, morebotsembed];

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
      const consol = c.channels.cache.get("899704750554112021");
      const guild = c.guilds.cache.get(g?.id);
      const ownerTag = guild?.fetchOwner().then((owner) => owner.user.tag);
      const name = guild?.name;
      const count = guild?.memberCount;

      const channel = await guild?.systemChannel;
      if (!channel)
        return consol?.send(`No system channel to welcome in **${name}**`);

      await c.channels.cache
        .get("895528930281410602")
        ?.send({ embeds: [e[0]] });

      if (count <= 5) {
        //             channel.send({embeds:[e[2]]}).catch((err) => consol?.send(`Couldn't send welcome message to **${name}**\n ${err}` ))
        await consol?.send(
          `Automatically left from **${name}** due to insufficient members.`
        );
      } else {
        channel
          .send({ embeds: [e[1]] })
          .catch((err) =>
            consol?.send(
              `Couldn't send welcome message to **${name}**\n ${err}`
            )
          );
      }
    },
    { context: { g: guild, e: embeds } }
  );

  const channel = await guild.systemChannel;
  if (count <= 5) {
    channel
      .send({ embeds: [notenoughmembers] })
      .catch((err) => console.log(err));
    guild.leave();
  }
};