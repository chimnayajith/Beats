const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const playlist = require("../models/playlist")
const playlistnew = require("../models/playlist")
const { QueryType , Track } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test command")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("playlist object id")
        .setRequired(true)
    ),

  async execute(client, interaction) {
      const objectId = interaction.options.get("query").value;
      const data = await playlist.findById({_id : objectId})
      interaction.reply({content : "Done" , ephemeral:true})
      const arr = data.playlist;
      let newarr = []
      for (i = 0; i < arr.length; i++) {
        // const search = await player.search(arr[i], {
        //   requestedBy: data.userID,
        //   searchEngine: QueryType.AUTO,
        // });
        
        // if (search.tracks[0]) {
          const spotifysearch = await player.search(arr[i], {
            requestedBy: client.users.resolve(data.userID),
            searchEngine: QueryType.SPOTIFY_SONG,
          });

          // console.log(spotifysearch.tracks[0].raw.url)
          // for (const each of spotifysearch.tracks){
              // newarr.push(each.raw)
            // }
          // newarr.push(spotifysearch.tracks[0].raw)
          // console.log(spotifysearch)
          if( spotifysearch.tracks[0] ) {
          //   for (const each of spotifysearch.tracks){
              newarr.push(spotifysearch.tracks[0].raw)
            }
          // }
        // }
        
      }

      const { userID , playlistName , image , Duration } = await data
    
      let newdata = await playlistnew.create({
        userID: userID,
        playlistName: playlistName,
        image : image,
        playlist: newarr,
        tracks: newarr.length,
        requestedBy:userID,
        Duration: Duration,
      });

      console.log(newdata)
      newdata.save();
      
    },
};