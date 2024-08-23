const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Collection } = require("discord.js");
const fs = require("fs");

module.exports = async () => {
  const commands = [];
  let rest;

  client.slashCommands = new Collection();

  const clientId = process.env.DISCORD_APPLICATION_ID;

  fs.readdirSync("./src/interactions").forEach((dirs) => {
    console.log(`\nLoading ${dirs} files`);
    const commandFiles = fs
      .readdirSync(`./src/interactions/${dirs}/`)
      .filter((file) => file.endsWith(".js"));

    rest = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN);

    for (const file of commandFiles) {
      console.log(`\t-> Loaded interaction ${file.split(".")[0]}`);
      const command = require(`../../interactions/${dirs}/${file}`);
      client.slashCommands.set(command.data.name.toLowerCase(), command);
      commands.push(command.data.toJSON());
    }
  });

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
