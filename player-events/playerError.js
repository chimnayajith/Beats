const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");

//Bot disconnected from voice channel
module.exports = async (queue , error) => {
    console.log(
        `Error emitted from the connection ${error.message}|${queue.guild.name}`
      );
      const message2 = `Connection Error at **${queue.guild.name}⠀|⠀${error.message}**`;
      client.shard.broadcastEval(
        async (c, { m }) => {
          const channel = c.channels.cache.get("899704750554112021");
          channel?.send(m);
        },
        { context: { m: message2 } }
      );
};