const { EmbedBuilder  , WebhookClient , ShardClientUtil} = require("discord.js");
const db = require('../../common/utils/scripts/analyticsUtil')
const stats = require('../../models/stats');

module.exports = async (client, guild) => {
  await stats.updateOne(
    { _id : "guilds"},
    { $pull: { guild_ids : guild.id}}
  );
    
  let ownerTag = await guild.fetchOwner().then((owner) => owner.user.tag);
  let name = guild.name;
  let count = guild.memberCount;
  let id = guild.id;

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
  const webhookClient = new WebhookClient({url : 'https://discord.com/api/webhooks/1118508137331306507/0TZe3roWpzv0DgMNC4h5AU1fARJ_eSFfqFMohWhMInSs6jL7is51xq1MJTJx1uiHz7ua'});
  webhookClient.send({embeds : [leaveguild]})
};


