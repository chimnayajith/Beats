const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = async() => {
    const commands = [];
    const commandFiles = fs.readdirSync('./src/guildInteractions').filter(file => file.endsWith('.js'));

    const clientId = process.env.DISCORD_APPLICATION_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    for (const file of commandFiles) {
        const command = require(`../../guildInteractions/${file}`);
        client.slashCommands.set(command.data.name.toLowerCase(), command);
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: "10"}).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Started refreshing Guild (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded Guild (/) commands.');
    } catch (error) {
        console.error(error);
    }

}