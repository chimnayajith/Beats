const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder} = require("discord.js");
//Empty voice channel
module.exports = async (queue) => {
    const empty = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle(":thought_balloon: ⠀ | ⠀Leaving due to inactivity")
    .setDescription("Hope you had a good time listening.");
    const vote_patreon = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
        .setURL("https://beatsbot.in/vote")
        .setLabel("Upvote")
        .setEmoji(`<a:vote:956901647043416104>`)
        .setStyle(5)
    )
    .addComponents(
    new ButtonBuilder()
        .setURL("https://beatsbot.in/patreon")
        .setLabel("Patreon")
        .setEmoji(`<:patreon:956903191507763240>`)
        .setStyle(5)
    );
    queue.delete();
    queue.metadata.interaction.channel.send({
    embeds: [empty],
    components: [vote_patreon],
    }).then((message) => setTimeout(() => message.delete(), 30000)) ||
    queue.connection.channel.send({
        embeds: [empty],
        components: [vote_patreon],
    }).then((message) => setTimeout(() => message.delete(), 30000));
};