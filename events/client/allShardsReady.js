const stats = require("../../models/stats");
module.exports = async (client) => {

  if(process.env.NODE_ENV !== "development"){
    setTimeout(() => {
      const guildArray = [];
      const promises = [];
      promises.push(client.shard.broadcastEval((client) => client.guilds.cache.map((guild) => guild.id)));
      Promise.all(promises)
        .then(async(results) => {
          results.forEach((guilds) => {
            if (guilds.length) {
              guildArray.push(...guilds);
            }
          });
          const flattenedArray = guildArray.flat();
          await stats.updateOne(
            { _id : "guilds"},
            { $set: { guild_ids : flattenedArray}}
          );
        })
        .catch(console.error) 
    } , 3000)
  }
}