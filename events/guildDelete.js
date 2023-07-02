  const { EmbedBuilder  , WebhookClient} = require("discord.js");
  const db = require('../utils/analyticsUtil')

  module.exports = async (client, guild) => {
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
      

    const webhookClient = new WebhookClient({url : 'https://discord.com/api/webhooks/1118508137331306507/0TZe3roWpzv0DgMNC4h5AU1fARJ_eSFfqFMohWhMInSs6jL7is51xq1MJTJx1uiHz7ua'});
    webhookClient.send({embeds : [leaveguild]})
  };
