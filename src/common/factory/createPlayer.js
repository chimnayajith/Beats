const { Player } = require('discord-player');
//const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei")
const { SpotifyExtractor } = require("@discord-player/extractor")
const { YoutubeiExtractor } = require("discord-player-youtubei")

module.exports = async () => {
    try{
        const player = new Player(client, {
            useLegacyFFmpeg: false,
            skipFFmpeg:true

        });
        
        player.on("debug", console.log).events.on("debug", (_, m) => console.log(m));
		await player.extractors.register(YoutubeiExtractor, {
			authentication: "access_token=ya29.a0AXooCgvO-dKrD_hs2MER8XHwiOGCfxaLphgFNq-yayf3nITYkhiOGwbmRONBaf9JjkqEmAjhDdlCRo9DfHjwZxexL9tGfjh9atz4PAiJuWdzDO09a8vsoffVV3Lj0fiY58ofGVArcVpaNxodN_t9ILlAfDnhioJEBjD_2uilLBk12vleaCgYKAX8SARESFQHGX2Mi0isNIZcXQIJCQl32u_4aIg0183; refresh_token=1//09dEc9RWLnFWeCgYIARAAGAkSNwF-L9IrbHf07LXieEmp1caBGmLl3AAy1gnpGWC2E17sCqP7fqV3MTp2vqs9o4paPw6lL7rGeBY; scope=https://www.googleapis.com/auth/youtube-paid-content https://www.googleapis.com/auth/youtube; token_type=Bearer; expiry_date=2024-07-31T23:43:26.614Z",
			/*
			rotator: {
				rotationStrategy: "shard",
				authentications: getAuthArrayFromEnv() || [""],
				currentShard: client.shard?.ids[0] || 0,
			},
			*/
			streamOptions: {
				useClient: "ANDROID",
			},
		});

		global.player = player;

		await player.extractors.loadDefault(
			(ext) => !["YouTubeExtractor"].includes(ext),
		);

		return player;
    } catch(error){
        console.log("Failed to create  discord-player player")
        throw(error);
    }
};