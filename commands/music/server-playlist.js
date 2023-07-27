const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , PermissionFlagsBits} = require("discord.js");
const mongoose = require('mongoose');
const { QueryType , Track} = require('discord-player');
const { joinVoiceChannel } = require("@discordjs/voice");
const db = require("../../models/serverPlaylists");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-playlists")
    .setDescription("Setup your server playlists")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup your server playlist")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role that can manage the playlist")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the playlist")
            .setRequired(true)
        )   
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Saves the current track to the server playlist")
        .addStringOption((option) =>
          option
            .setName("playlist")
            .setDescription("Server playlist you want to add the track to")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Play your saved server playlists")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the playlist")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  voiceChannel: false,
  vote: true,
  category: "",
  utilisation: "",
  async autocomplete(interaction) {
    const data = await db.find({guildID : interaction.guild.id});
    if(data) return await interaction.respond(data.map((each) => ({ name : `${each.playlistName.substring(0, 85)} - ${each.playlistTracks.length} tracks` , value : each._id})))
  },
  async execute(client, interaction) {

    if(interaction.options.getSubcommand() === "setup"){
        const data = await db.find({guildID : interaction.guild.id});

        //Manage guild permission needed!
        const no_perm = new EmbedBuilder().setColor("#2f3136").setDescription("<a:warn:889018313143894046>⠀ | ⠀You need the `Manage Guild` permission to create server playlist!");
        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({embeds : [no_perm] , ephemeral : true});
        
        //server already has 2 playlists!
        const maxPlaylist = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀ Server already has 2 server playlists.`);
        if ( data.length === 2) return interaction.reply({embeds : [maxPlaylist] , ephemeral : true});


        let newdata = await db.create({
            guildID: interaction.guild.id,
            roleID: interaction.options.get('role').value,
            playlistName: interaction.options.get("name").value,
            playlistTracks: [],
            tracks: 0,
          });
        newdata.save();

        // succesfully created
        const playlistCreated = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle("Server Playlist Created!")
            .addFields(
                { name : "Playlist Name" , value : `\`${newdata.playlistName}\`` , inline : true},
                { name : "Playlist Manager Role" , value : `<@&${newdata.roleID}>` , inline : true},
                { name : "\u200B" , value : `Use </server-playlists add:1126830641154109560> to add songs to the playlist` , inline : false}
            )
            .setThumbnail(newdata.image)
            .setTimestamp()
            .setFooter({ text : interaction.guild.name , iconURL:interaction.guild.iconURL()});
        interaction.reply({ embeds : [playlistCreated]}) 

    } else if ( interaction.options.getSubcommand() === "add" ){

        // No existing server playlist
        const serverplaylists = await db.find({guildID : interaction.guild.id});
        const noPlaylists = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Server doesn't have any playlist. Use \`/server-playlists setup\` to create a playlist!`);
        if(!serverplaylists) return interaction.reply({embeds : [noPlaylists] , ephemeral : true})

        const playlistId = interaction.options.get('playlist').value;

        const invalidPlaylist = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Choose from an existing playlist!`);
        
        //not object id
        if( !mongoose.Types.ObjectId.isValid(playlistId)) return interaction.reply({embeds : [ invalidPlaylist] , ephemeral : true});
        
        const data = await db.findById({ _id : playlistId });

        // Invalid Option selected
        if(!data) return interaction.reply({embeds : [ invalidPlaylist] , ephemeral : true});

        // no manager role. admins excluded
        const notManager = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀|⠀You need the <@&${data.roleID}> role to add songs to \`${data.playlistName}\``);
        if(!interaction.member.roles.cache.has(data.roleID)) return interaction.reply({ embeds: [notManager], ephemeral: true });

        const queue = player.nodes.get(interaction.guild.id);

        // no music
        const noMusic = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ No track is playing to add to playlist!`);
        if (!queue || !queue.isPlaying()) return interaction.reply({ embeds: [noMusic], ephemeral: true });
        
        const trackData = {
            source : queue.currentTrack.raw.source,
            title : queue.currentTrack.title,
            description : queue.currentTrack.raw.description,
            author : queue.currentTrack.author,
            url : queue.currentTrack.raw.url || queue.currentTrack.url,
            thumbnail : queue.currentTrack.thumbnail, 
            duration : queue.currentTrack.duration,
            views : queue.currentTrack.views,
            requestedBy:queue.currentTrack.requestedBy.id,
            queryType: queue.currentTrack.queryType
        }
        await db.updateOne(
            { 
                _id : playlistId 
            },
            {
                $push : { playlistTracks : { $each: [trackData], $position: 0 }},
                $inc  : { tracks : +1 }
        });

       const addedToPlaylist = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(`[${queue.currentTrack.title}](${queue.currentTrack.url}) added to server playlist : ${data.playlistName}.\n\nUse </server-playlists play:1126830641154109560> to play songs in the playlist!`)
        .setTitle('Added to Playlist')
        .setThumbnail(data.image);

        interaction.reply({embeds : [addedToPlaylist]})

    } else if ( interaction.options.getSubcommand() === "play" ){
        const playlistId = interaction.options.get('name').value;

        const invalidPlaylist = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Choose from an existing playlist!`);
        
        //not object id
        if( !mongoose.Types.ObjectId.isValid(playlistId)) return interaction.reply({embeds : [ invalidPlaylist] , ephemeral : true});
        
        const data = await db.findById({ _id : playlistId });

        const noTracks = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ No tracks added to \`${data.playlistName}\`. Use </server-playlists add:1126830641154109560> to add songs to the playlist`);
        if (data.playlistTracks.length === 0) return interaction.reply({embeds : [noTracks] , ephemeral : true});

        const joinVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`:microphone2:⠀ | ⠀Join a voice channel first!`);
        const diffVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`);
        if (!interaction.member.voice.channel) return interaction.reply({ embeds: [joinVoice], ephemeral: true });
        if ( interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({ embeds: [diffVoice], ephemeral: true });

        const channelNoPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀\`Send Messages\` or \`View Channel\` permission denied for Beats in this channel.`);
        if(!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionFlagsBits.SendMessages , PermissionFlagsBits.ViewChannel])) return interaction.reply({embeds : [channelNoPermission]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 15000));

        const noPermission = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Voice channel access denied for Beats.`);
        if (!interaction.member.voice.channel.joinable) return interaction.reply({embeds : [noPermission]});

        joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
        });

        const playlistLoading = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your Server Playlist : ${data.playlistName}`)
        const queue = player.nodes.get(interaction.guild.id);
        const tracks = [];
        for (const song of data.playlistTracks) {
            const track = new Track(interaction.client, {
                author: song.author,
                description: song.description || song.title,
                duration: song.duration,
                thumbnail: song.thumbnail,
                title: song.title,
                url: song.url,
                views: song.views,
                requestedBy: client.users.resolve(song.requestedBy),
                queryType: QueryType.AUTO,
                source: 'server-playlist',
                playlist: {
                    title : data.playlistName,
                    thumbnail : data.image,
                    source : 'server-playlist!',
                    tracks :  data.playlistTracks ,
                }
            });
            tracks.push(track)
        }

        const playlist = player.createPlaylist({
        author: { name: interaction.guild.id, url: tracks[0].url },
        description: '',
        source: 'youtube',
        thumbnail: tracks[0].thumbnail,
        title: data.playlistName,
        tracks,
        type: 'playlist',
        url: tracks[0].url
        });

        if(!queue) {
            const queue = player.nodes.create(interaction.guild, {
            metadata: {
                    interaction : interaction,
            },
            noEmitInsert: true,
            volume: 50,
            selfDeaf: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 10000,
            })
    
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    
            queue.addTrack(playlist)
            queue.node.play()
            interaction.reply({embeds: [playlistLoading]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 5000));
        } else{
            interaction.reply({embeds: [playlistLoading]}).then((interaction) => setTimeout(() => interaction.delete().catch(console.error), 5000));
            queue.addTrack(playlist.tracks)
        }

        }
  },
};