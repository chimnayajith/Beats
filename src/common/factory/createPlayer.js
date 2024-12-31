const { Player } = require("discord-player");
// const { YoutubeiExtractor } = require("discord-player-youtubei");
const { DeezerExtractor } = require("discord-player-deezer");
module.exports = async () => {
  try {
    const player = new Player(client, {
      useLegacyFFmpeg: false,
      skipFFmpeg: true,
    });

    player
      .on("debug", console.log)
      .events.on("debug", (_, m) => console.log(m));
    global.player = player;
    await player.extractors.register(DeezerExtractor, {
      decryptionKey: "g4el58wc0zvf9na1",
    });
    await player.extractors.loadDefault(
      (ext) => !["YouTubeExtractor"].includes(ext),
    );
    global.player = player;
    return player;
  } catch (error) {
    console.log("Failed to create  discord-player player");
    throw error;
  }
};
