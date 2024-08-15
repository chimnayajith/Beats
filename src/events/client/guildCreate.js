const { EmbedBuilder, ChannelType, PermissionFlagsBits , WebhookClient, ShardClientUtil} = require("discord.js");
const db = require('../../common/utils/scripts/analyticsUtil')
const stats = require('../../models/stats');
const config = require("config");

const botOptions = config.get("botOptions");

module.exports = async (client, guild) => {
  await stats.updateOne(
    { _id : "guilds"},
    { $push: { guild_ids : guild.id}}
  );
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
    .setThumbnail(botOptions.logoUrl)
    .setDescription(
    `Unleash the rhythm and elevate your Discord server with Beats, the ultimate music bot that brings harmony, energy, and a symphony of melodies to your online community.\n\nBeats uses slash commands.You can get started by using : </help:957138913833668629>.\n\n **[Website](https://beatsbot.in)⠀|⠀[Commands](https://dashboard.beatsbot.in/commands)  ⠀|⠀ [Blog](https://blog.beatsbot.in/)  ⠀|⠀[Support Server](https://discord.gg/JRRZmdFGmq)**\n\n**Enjoy Music with Beats!!<:beats:1115516004886388736>**`
    );
    
    const promises = [
      client.shard.fetchClientValues("guilds.cache.size"),
      client.shard.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ];
    Promise.all(promises).then(async (results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      
      if (totalGuilds % 10 === 0 ){
        await client.shard.broadcastEval(async(c , {guilds , members}) => {
          const servercount = await c.channels.cache.get('889694415310962739');
          servercount.setName(`Server Count: ${guilds}`);
          const usercount = await c.channels.cache.get('889695060965355550');
          usercount.setName(`Users: ${members}`);
          
        }, {
          shard: ShardClientUtil.shardIdForGuildId('889016432627707924', client.shard.count),
          context : { guilds: totalGuilds, members :totalMembers }
        });  
      }
      db.addData(totalGuilds, totalMembers);
    }); 
  

  async function getDefaultChannel(guild) {
    const channel = guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel , PermissionFlagsBits.EmbedLinks]));
      return channel;
  }
  
  const channel = await guild.systemChannel || await getDefaultChannel(guild);

  channel.send({ embeds: [newGuild] })
         .catch(console.error);

  const webhookClient = new WebhookClient({id:'1118369501679976479', token:'urX29dG8RvTL_urvJTiW0CCOztoziRCyLo-Pe_PqeR8ThUU4786otU28zpqUk5qAjmFJ'});
  webhookClient.send({embeds : [newGuild1]});
};