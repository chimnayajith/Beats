const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./guild-slash').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '905148129215668254';
const guildId = '891226549297238036';

for (const file of commandFiles) {
	const command = require(`../guild-slash/${file}`);
	client.slashCommands.set(command.data.name.toLowerCase(), command);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken("OTA1MTQ4MTI5MjE1NjY4MjU0.GiZ9QU.XBJ5mNZl8kVKW_0ADzjxf8J1P70ksFrmMqZDBo");

(async () => {
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
})();
