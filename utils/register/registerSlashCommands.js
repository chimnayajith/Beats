const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Collection } = require("discord.js");
const fs = require("fs");

const commands = [];
let rest;

client.slashCommands = new Collection();

const clientId = "905148129215668254";

fs.readdirSync("./commands").forEach((dirs) => {
  console.log(`\nLoading ${dirs} files`);
  const commandFiles = fs
    .readdirSync(`./commands/${dirs}/`)
    .filter((file) => file.endsWith(".js"));

  rest = new REST({ version: "9" }).setToken("OTA1MTQ4MTI5MjE1NjY4MjU0.GiZ9QU.XBJ5mNZl8kVKW_0ADzjxf8J1P70ksFrmMqZDBo");

  for (const file of commandFiles) {
    console.log(`\t-> Loaded command ${file.split(".")[0]}`);
    const command = require(`../../commands/${dirs}/${file}`);
    client.slashCommands.set(command.data.name.toLowerCase(), command);
    commands.push(command.data.toJSON());
  }
});
(async () => {
  try {
    console.log("\x1b[34m%s\x1b[0m", "Started refreshing application (/) commands.")
    // console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("\x1b[32m%s\x1b[0m", "Successfully reloaded application (/) commands")
    // console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
