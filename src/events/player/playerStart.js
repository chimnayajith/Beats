const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , StringSelectMenuBuilder ,PermissionFlagsBits} = require("discord.js");
const {addSongs}  = require("../../common/utils/scripts/likedUtil");
const recents  = require("../../common/utils/scripts/recentUtil");
const { SpotifyExtractor } = require("@discord-player/extractor");
const { logIfRequired } = require("../../common/utils/scripts/settingsUtil");

module.exports = async (queue , track ) => {
  await logIfRequired(queue.options.guild.id ,queue.options.guild.ownerId, "playLogs" , {
    guildName: queue.options.guild.name,
    guildID: queue.options.guild.id,
    guildIcon: queue.options.guild.iconURL(),
    trackName : track.title,
    trackUrl : track.url,
    userID : track.requestedBy.id,
    voiceChannel : queue.channel.id
  })
  recents.addRecents(track.requestedBy.id , queue.options.guild.id , track)
  const  [minutes, seconds] = track.duration.split(":").map(Number); 
  const totalDuration  = (minutes*60*1000) + (seconds *1000)
  const embed1 = new EmbedBuilder()
    .setTitle(`<a:diskspin:889018326578233384> Now Playing `)
    .setColor("#2f3136")
    .setDescription(`[${track.title}](${track.url})`) 
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "Duration", value: ` \`${track.duration}\` `, inline: true },
      {
        name: "Channel",
        value: `<#${queue.channel.id}>`,
        inline: true,
      },
      { name: "Requested By", value: `${track.requestedBy}`, inline: true }
    );

  const likeSuccess = new EmbedBuilder().setColor("#2f3136").setTitle(`${track.title} Liked`).setURL('https://dashboard.beatsbot.in/likedsongs').setDescription("Track has been added to your liked songs. Use the command \`/liked\` to play your liked songs!").setThumbnail('https://cdn.beatsbot.in/attachments/favourites.png')
  const dupeTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ This track is already liked by you!`)
  const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("like")
        .setLabel("Add to Liked!")
        .setEmoji("<:fave:1054803532244598824>")
        .setStyle(2),
      new ButtonBuilder()
        .setCustomId('suggestions')
        .setLabel("Suggestions!")
        .setEmoji("<:suggest:1118767302263967934>")
        .setStyle(2)
  );
  if(queue.metadata.interaction.guild.members.me.permissionsIn(queue.metadata.interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel,  PermissionFlagsBits.EmbedLinks])
) {
    const newTrack = await queue.metadata.interaction.channel
      .send({
        embeds: [embed1] ,
        components: [row],
        fetchReply: true
      })
      queue.setMetadata({
        ...queue.metadata,
        playMessage: newTrack
      });
    const collector = newTrack.createMessageComponentCollector({
        time : totalDuration,
        componentType: 2,
      });

    collector.on("collect", async (collected) => {
      await collected.deferUpdate();  
      if(collected.customId === 'like'){
        
        const status = await addSongs(collected.user.id , track);//0-duplicate track; 1- song added to liked songs
          switch (status) {
            case 0 : 
              collected.followUp({ embeds : [dupeTrack] , ephemeral : true})
              break;
            case 1 :
              collected.followUp({ embeds : [likeSuccess] , ephemeral : true})
              break;
        }
    } else if ( collected.customId === 'suggestions'){
      const spotifyExtractor = player.extractors.get(SpotifyExtractor.identifier);
      const relatedTracks = (track.extractor) ? await track.extractor.getRelatedTracks(track) : await spotifyExtractor.getRelatedTracks(track);
      
      const searchEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle(`Suggestions!`)
        .setDescription(
        `\n\n${relatedTracks.tracks
          .map((t, i) => `**${i + 1}**) [${t.title} - ${t.author}](${t.url})`)
          .slice(0, 10)
          .join("\n")}\n\nSelect choice [1-10] or *cancel*`)


      const cancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn");
      const dCancel = new ButtonBuilder().setLabel("Cancel").setStyle(4).setCustomId("cancel_btn").setDisabled();

      const cRow = new ActionRowBuilder().addComponents([cancel]);
      const dcRow = new ActionRowBuilder().addComponents([dCancel]);

      const mOptions = relatedTracks.tracks.slice(0, 10).map((each, i) => ({ label: each.title.substr(0,90), value: i.toString() }));

      const menu = new StringSelectMenuBuilder()
        .addOptions(mOptions)
        .setPlaceholder("Choose the song")
        .setCustomId("schMenu")
        .setMaxValues(1)
        .setMinValues(1);

      const dMenu = new StringSelectMenuBuilder()
        .addOptions(mOptions)
        .setPlaceholder("Choose the song")
        .setCustomId("schMenu")
        .setMaxValues(1)
        .setMinValues(1)
        .setDisabled();

      const mRow = new ActionRowBuilder().addComponents(menu);

      const dmRow = new ActionRowBuilder().addComponents(dMenu);



      const msg = await collected.followUp({embeds : [searchEmbed] , components : [mRow, cRow] , fetchReply : true})

      const collector = msg.createMessageComponentCollector({
        time: 30000,
        errors: ["time"],
      });

      collector.on("collect", async (collected) => {
          if (collected.isButton()) {
          if (collected.customId === "cancel_btn") {
            await collected.deferUpdate();
            await collected.editReply({embeds: [searchEmbed], components: [] });
          }
        }
        if (collected.isStringSelectMenu()) {
          const embed2 = new EmbedBuilder().setColor("#2f3136").setDescription("You should be in the listening party");
          if (!collected.member.voice.channel || collected.guild.members.me.voice.channel && collected.member.voice.channel.id !== collected.guild.members.me.voice.channel.id)
              {
                await collected.deferUpdate();
                return collected.followUp({ embeds: [embed2], ephemeral: true });
              }  
          const select = collected.values[0];
          const switchint = parseInt(select) ;

          player.play(collected.member.voice.channel.id, relatedTracks.tracks[switchint], {
            requestedBy: collected.user,
              nodeOptions: {
                metadata:{
                  interaction : collected,
                },
                noEmitInsert: true,
                skipOnNoStream: true,
                volume: 50,
                selfDeaf: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 10000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 10000,
              },
          });

          await collected.deferUpdate();
          await collected.editReply({ embeds: [searchEmbed], components: [] });
        }
      });
    }
  
  });
}
};