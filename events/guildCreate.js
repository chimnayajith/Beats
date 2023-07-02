const { EmbedBuilder, ChannelType, PermissionFlagsBits , WebhookClient, DefaultDeviceProperty} = require("discord.js");
const db = require('../utils/analyticsUtil')

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
    `Unleash the rhythm and elevate your Discord server with Beats, the ultimate music bot that brings harmony, energy, and a symphony of melodies to your online community.\n\nBeats uses slash commands.You can get started by using : </help:957138913833668629>.\n\n **[Website](https://beatsbot.in)⠀|⠀[Commands](https://dashboard.beatsbot.in/commands)  ⠀|⠀ [Blog](https://blog.beatsbot.in/)  ⠀|⠀[Support Server](https://discord.gg/JRRZmdFGmq)**\n\n**Enjoy Music with Beats!!<:beats:1115516004886388736>**`
    );
    
  client.shard.broadcastEval(async (c) => {
    const promises = [
      c.shard.fetchClientValues("guilds.cache.size"),
      c.shard.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];
  
    return Promise.all(promises).then((results) => {
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

      const data = [totalGuilds, totalMembers];
      return data;
    });
  }).then((data) => {
    db.addData(data[0][0] , data[0][1])
  });
  

  async function getDefaultChannel(guild) {
    const channel = guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has('SendMessages'));
      return channel;
  }
  
  const channel = await guild.systemChannel || await getDefaultChannel(guild);

  channel.send({ embeds: [newGuild] })
         .catch();

  const webhookClient = new WebhookClient({id:'1118369501679976479', token:'urX29dG8RvTL_urvJTiW0CCOztoziRCyLo-Pe_PqeR8ThUU4786otU28zpqUk5qAjmFJ'});
  webhookClient.send({embeds : [newGuild1]});
};


