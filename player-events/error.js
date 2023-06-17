
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");

//Player errorr
module.exports = async (queue, error) => {
    console.log(`Error at ${queue.guild.id} | ${error.message}`);
  const message1 = `Error at **${queue.guild.name}\t|\t${error.message}**`;
  client.shard.broadcastEval(
    async (c, { m }) => {
      const channel = c.channels.cache.get("899704750554112021");
      channel?.send(m);
    },
    { context: { m: message1 } }
  );

};