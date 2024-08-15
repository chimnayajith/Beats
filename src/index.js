const dotenv = require('dotenv');
dotenv.config();
const { ShardingManager, ShardEvents } = require("discord.js");

const config = require("config");
const shardingOptions = config.get("shardingOptions");


const manager = new ShardingManager("./src/main.js", {
  token:process.env.DISCORD_BOT_TOKEN,
  ...shardingOptions
});

const readyShards = new Set();

manager.on("shardCreate", async (shard) =>{
    console.log(`Launched shard ${shard.id}`);

    shard.on(ShardEvents.Ready, () => {
        readyShards.add(shard.id);
        if (readyShards.size === manager.totalShards) {
            manager.broadcastEval((client) => client.emit("allShardsReady"));
            console.log('All shards ready, Beats is now online.');
        }
    });

    shard.on(ShardEvents.Death, (event) => {
        console.log(`SHARD CLOSED UNEXPECTEDLY : ${JSON.stringify(event)}`);
    });

    shard.on(ShardEvents.Error, (error) => {
        console.log(`Shard experienced an error, most likely related to websocket connection error : ${error}`);
    });

    shard.on(ShardEvents.Disconnect, () => {
        console.log('Shard disconnected.');
    });

    shard.on(ShardEvents.Reconnecting, () => {
        console.log('Shard reconnecting.');
    });
});


manager.spawn();