const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder ,WebhookClient} = require("discord.js");

//Track End
module.exports = async (queue , track) => {
    queue.metadata.playMessage?.delete().catch(console.error);
};