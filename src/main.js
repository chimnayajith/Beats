const dotenv = require("dotenv");
dotenv.config();
const createClient = require("./common/factory/createClient");
const createPlayer = require("./common/factory/createPlayer");
const registerEvents = require("./common/startup/registerEvents");
const registerGuildCommands = require("./common/startup/registerGuildComands");
const registerSlashCommands = require("./common/startup/registerSlashCommands");
(async () => {
  try {
    const client = await createClient();
    await createPlayer();

    let allShardsReadyReceived = false;

    client.on("allShardsReady", async () => {
      if (allShardsReadyReceived) return;

      await registerEvents();
      await registerSlashCommands();
      await registerGuildCommands();
      require("./common/startup/connectDB");
      require("./common/utils/other/socket-io");
      require("./common/utils/other/voteReminder");
      client.emit("ready");
      allShardsReadyReceived = true;
    });
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.log(err);
  }
})();
