const stats = require("../models/stats")
module.exports = async (client, guild) => {
  client.shard.broadcastEval(async (c) => {
    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];
    Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      
      const fs = require('fs');
      const statsData = fs.readFileSync('stats/stats.json', 'utf8');
      const stats = JSON.parse(statsData);
      stats.totalGuilds = totalGuilds; 
      stats.totalMembers = totalMembers;
      const updatedStatsData = JSON.stringify(stats);
      fs.writeFileSync('stats/stats.json', updatedStatsData, 'utf8');
    });

  }).then(() =>{
    const fs = require('fs');
    fs.readFile('stats/stats.json', 'utf8', (error, data) => {
    const jsonData = JSON.parse(data);
    const totalGuilds = jsonData.totalGuilds;
    const totalMembers = jsonData.totalMembers;
    
    stats.findOneAndUpdate(
      { 
        _id : "bot_stats"
      }, 
      { 
        $set :{
          serverCount : totalGuilds, 
          userCount : totalMembers 
        }
      }, 
      { 
        upsert: true 
      })
});

  })

};


