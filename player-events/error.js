
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder , WebhookClient} = require("discord.js");

//Player errorr
module.exports = async (queue, error) => {
    console.log(`Error at ${queue.guild.id} | ${error.message}`);
  // const message1 = `Error at **${queue.guild.name}\t|\t${error.message}**`;
  // client.shard.broadcastEval(
  //   async (c, { m }) => {
  //     const channel = c.channels.cache.get("899704750554112021");
  //     channel?.send(m);
  //   },
  //   { context: { m: message1 } }
  // );
   const embed = new EmbedBuilder().setColor("#2f3136").setDescription(`\`\`\`${error.stack.slice(0,4094)}\`\`\``).setTitle(`Error at ${queue.guild.name} | ${error.message}`)
    const webhookClient = new WebhookClient({url : "https://discord.com/api/webhooks/1121858697812000838/63nYVPjOrhBM3xGh50peX_PRSKg18iuSX1982CBLIHYCXNBceM01tPfr1aluom4EyZOm"});
    webhookClient.send({embeds : [embed]});

};