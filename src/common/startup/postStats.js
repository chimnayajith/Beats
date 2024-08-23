const stats = require("../../models/stats");

module.exports = async () => {
  try {
    // Fetch guild IDs from all shards
    setTimeout(() => {
      const sed = [];
      const promises = [];
      promises.push(
        client.shard.broadcastEval((client) =>
          client.guilds.cache.map((guild) => guild.id),
        ),
      );
      Promise.all(promises)
        .then(async (results) => {
          results.forEach((guilds) => {
            if (guilds.length) {
              sed.push(...guilds);
            }
          });
          const flattenedArray = sed.flat();

          await stats.updateOne(
            { _id: "guilds" },
            { $set: { guild_ids: flattenedArray } },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }, 3000);

    // Fetch and update guild statistics
    const statsUpdate = await Promise.all([
      client.shard
        .broadcastEval(async (c) => c.guilds.cache.size)
        .then((results) =>
          results.reduce((acc, guildCount) => acc + guildCount, 0),
        ),
      client.shard
        .broadcastEval((c) =>
          c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
        )
        .then((results) =>
          results.reduce((acc, memberCount) => acc + memberCount, 0),
        ),
    ]);

    const totalGuilds = statsUpdate[0];
    const totalMembers = statsUpdate[1];

    // Update stats collection in the database
    await stats.findOneAndUpdate(
      { _id: "bot_stats" },
      { $set: { serverCount: totalGuilds, userCount: totalMembers } },
      { upsert: true },
    );

    console.log("Stats updated successfully"); // Log success message
  } catch (error) {
    console.error("Error updating stats:", error);
  }
};
