const { ShardingManager , ShardEvents } = require('discord.js');

const manager = new ShardingManager('./main.js', { 
    token: "OTA1MTQ4MTI5MjE1NjY4MjU0.GuRbYD.ga1gOAkBk2SWIgjToMRKfZtFCRY7cqVmRy3ALs"
});

manager.on('shardCreate',async (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();

const readyShards = new Set();
manager.on('shardCreate', shard => {
    shard.on(ShardEvents.Ready, () => {
        readyShards.add(shard.id);
        if(readyShards.size === manager.totalShards) {
            manager.broadcastEval(client => client.emit('allShardsReady'));
        }
    });
});