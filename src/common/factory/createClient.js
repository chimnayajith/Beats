const Discord = require('discord.js')
const { Client ,GatewayIntentBits, Partials, Options} = require('discord.js');

module.exports = async()=>{
    try{
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.DirectMessages
            ],
            partials : [Partials.Channel],
            disableMentions : "everyone",
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                MessageManager: 25,
                ThreadManager: 25,
                PresenceManager: 0,
                ReactionManager: 0,
                GuildMemberManager: {
                    maxSize: 50,
                    keepOverLimit: (member) => member.id === client.user?.id
                }
            }),
            sweepers: {
                ...Options.DefaultSweeperSettings,
                messages: {
                    interval: 3600,
                    lifetime: 1800
                },
                users: {
                    interval: 3600,
                    filter: () => (user) => user.id !== client.user?.id
                }
            }
        })
        
        global.client = client;

        return client;
    } catch (error) {
        console.log("Failed to create discord.js client")
        throw error;
    }
};