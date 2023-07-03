const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, StringSelectMenuBuilder , ActionRowBuilder} = require("discord.js");
const CryptoJS = require("crypto-js");
const spotifyPlaylists = require("../../models/spotifyPlaylists")
const { joinVoiceChannel } = require("@discordjs/voice");
const { QueryType , Track, useQueue } = require("discord-player");
const axios = require('axios')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("spotify")
    .setDescription("Play spotify playlists from your account!s")
    .addSubcommand((subcommand) =>
    subcommand
      .setName("connect").setDescription("Connect to your spotify account")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("play").setDescription("Choose from your spotify playlists!")
  ),

  voiceChannel: false,
  vote: false,
  category: "Music",
  utilisation: "/spotify",

  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "connect") {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ userID : interaction.user.id , expirationTimestamp : Date.now() + 300000  }) , '886801342239211522').toString();
        const connectSpotify = new EmbedBuilder().setColor("#2f3136").setDescription(`Connect your Spotify account by authorizing through the provided link .**[Click here](https://api.beatsbot.in/api/spotify/login?state=${btoa(encrypted)})**.\nPlease note that this link is for your personal use only and should not be shared with others. Sharing the link may allow unauthorized access to integrate their Spotify account with Beats!.\n\n Once authorized, you'll receive a DM (if your DMs are open) confirming the successful connection.\n\nAfter connecting, use the command </spotify play:1123951862236852304> to access your playlists and add them to the queue effortlessly.\n\nPlease be aware that this message will be automatically deleted in 5 minutes for security purposes.`).setTitle("<:spotify:1123967292900900965> Spotify Authorisation");
        const dmAuth = new EmbedBuilder().setColor("#2f3136").setDescription("Authorization links and details have been sent to your direct messages (DM). Please check your DMs promptly as the message will be automatically deleted after 5 minutes.");
        const dmClosed = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ Authorization details and links will be sent via DM. Please change your privacy settings allowing Beats to send a DM.`);
        
        interaction.user.send({embeds : [connectSpotify]}).then((message) => {
            setTimeout(() => message.delete(), 300000)
            interaction.reply({ embeds: [dmAuth] , ephemeral:true});
          }).catch(() => {
            interaction.reply({ embeds: [dmClosed], ephemeral: true });
          });
          
    } else if (interaction.options.getSubcommand() === "play") {
        const userData = await spotifyPlaylists.findOne({_id : interaction.user.id});   
        const notIntegrated = new EmbedBuilder().setColor("#2f3136").setDescription("You don't have a linked Spotify account. To authorize your Spotify account and access all your playlists in Beats, use the command </spotify connect:1123951862236852304>.")
        if(!userData) return interaction.reply({embeds : [notIntegrated] , ephemeral: true})
       
        async function generateToken(refresh_token){
            const response = await axios.get('https://api.beatsbot.in/api/spotify/refresh_token' , {
                headers : {"Content-Type" : "application/json"},
                data : {"refresh_token" : refresh_token}
                })
            await spotifyPlaylists.findOneAndUpdate({
                _id : userData._id
            },
            {
                $set : {
                    expires : response.data.expires_in,
                    access_token : response.data.access_token
                }
            })
            return response.data.access_token;
        }   

        const access_token = ( Date.now() > new Date(userData.expires).getTime()) ? await generateToken(userData.refresh_token) : userData.access_token;

        const response = await axios.get(userData.spotifyPlaylists, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${access_token}`
            }
          })
        const data = response.data;
        const playlistData = data.items

        const pages = []

        const playlistsEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`<:spotify:1123967292900900965> Spotify Playlists : ${interaction.user.username}`).setThumbnail(`https://media.discordapp.net/attachments/889016433252634657/1124046362615500820/306f6a14403921a4d8b4ab53d3c9f2a3.png`);
        const row  = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('previous').setEmoji('<:left_arroe:901325048189698078>').setStyle(2),
            new ButtonBuilder().setCustomId('balaaaa').setLabel("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀").setStyle(2).setDisabled(true),
            new ButtonBuilder().setCustomId('next').setEmoji('<:right_arroe:901325048261005322>').setStyle(2),
          );
        function paginatePlaylists (){
            playlistsEmbed.setDescription(pages[current]).setFooter({text : `Page : ${current + 1}/${pages.length}`})
        }
        const options = [];
        const options2 = [];
        const playlistInfo = playlistData.map((playlist , i ) => {
            const { external_urls, name, tracks } = playlist;
            const trackCount = tracks.total.toString()
            const playlistName = name.length > 22 ? name.substring(0, 19) + '...' : name; // Adjust the length for truncation and width for alignment
            (i<=24) ? options.push({ label: playlistName, value: `${i}` }) : options2.push({ label: playlistName, value: `${i}` })
            return `${i+1}) [${playlistName}](${external_urls.spotify})\u2003•\u2003${trackCount} tracks`; // Use \u2003 for an em-space character
        });
        const row1 = new ActionRowBuilder();
        const row2 = new ActionRowBuilder();
        if (playlistData.length > 24){
            pages.push(playlistInfo.slice(0,25).join('\n'))
            pages.push(playlistInfo.slice(25,playlistData.length).join('\n'))
            row1.addComponents(
                new StringSelectMenuBuilder()
                .addOptions(options)
                .setPlaceholder("Choose the playlist")
                .setCustomId("spotifyMenu1")
                .setMaxValues(1)
                .setMinValues(1)
            );
            row2.addComponents(
                new StringSelectMenuBuilder()
                .addOptions(options2)
                .setPlaceholder("Choose the playlist")
                .setCustomId("spotifyMenu2")
                .setMaxValues(1)
                .setMinValues(1)
            );
        } else {
            pages.push(playlistInfo.join('\n'))
            row1.addComponents(
                new StringSelectMenuBuilder()
                .addOptions(options)
                .setPlaceholder("Choose the playlist")
                .setCustomId("spotifyMenu1")
                .setMaxValues(1)
                .setMinValues(1)
            );
        }
        let current = 0;
        paginatePlaylists();
        const playlists = (pages.length > 1 ) ? await interaction.reply({embeds : [playlistsEmbed] , components: [row1 , row] , fetchReply : true}) : await interaction.reply({embeds : [playlistsEmbed] , components : [row1] , fetchReply : true});
        
        const collector = playlists.createMessageComponentCollector({});
          
        collector.on("collect", async (collected) => {
            if(collected.componentType === 2){
                await collected.deferUpdate();

                const notYourPlaylist= new EmbedBuilder().setColor("#2f3136").setDescription(`<:huh:897560243624640563>⠀|⠀ This is not your playlist!`);
                if (collected.user.id !== interaction.user.id) return collected.followUp({ embeds : [notYourPlaylist],ephemeral: true,});

                const value = collected.customId;
                if (value === "next"){
                    ( current === playlistData.length -1) ? current : current++;
                    paginatePlaylists()
                    collected.editReply({ embeds : [playlistsEmbed] , components : [row2 , row]})
                } else if ( value === "previous"){
                    ( current === 0) ? current : current--;
                    paginatePlaylists()
                    collected.editReply({ embeds : [playlistsEmbed] , components : [row1 , row]})
                }
            } else if (collected.componentType === 3) {
                await collected.deferUpdate();

                const notYourPlaylist= new EmbedBuilder().setColor("#2f3136").setDescription(`<:huh:897560243624640563>⠀|⠀ This is not your playlist!`);
                if (collected.user.id !== interaction.user.id) return collected.followUp({ embeds : [notYourPlaylist],ephemeral: true,});

                // private playlists 0_0
                if(!playlistData[parseInt(collected.values[0])].public && !(playlistData[parseInt(collected.values[0])].owner.uri === 'spotify:user:spotify')){
                    const noVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Join a voice channel first!`);
                    const diffVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`);
                    if (!interaction.member.voice.channel) return collected.followUp({ embeds: [noVoice],components : [], ephemeral: true });
                    if (interaction.guild.members.me.voice.channel &&interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return collected.followUp({ embeds: [diffVoice],components : [], ephemeral: true });
                    const loading  = new EmbedBuilder().setColor("#2f3136").setDescription('<a:loading:889018179471441941>⠀ | ⠀Loading your playlist');
                    collected.editReply({embeds : [loading] , components : []})

                    const pvt_playlist = await axios.get(playlistData[parseInt(collected.values[0])].href ,{
                        headers : {
                            "Content-Type" : "application/x-www-form-urlencoded",
                            "Authorization" : `Bearer ${access_token}`
                        }
                    })
                    const urls = pvt_playlist.data.tracks.items.map((item) => item.track.external_urls.spotify)
                    let arr = []
                    for (i = 0; i < urls.length; i++) {
                        const search = await player.search(urls[i], {
                            requestedBy: interaction.member,
                            searchEngine: QueryType.SPOTIFY_SONG,
                        });
                        arr.push(search.tracks[0].raw);
                    };
                    const tracks = [];
                    for (const song of arr) {
                        const track = new Track(interaction.client, {
                            author: song.author,
                            description: song.description || song.title,
                            duration: song.duration,
                            thumbnail: song.thumbnail,
                            title: song.title,
                            url: song.url,
                            views: song.views,
                            requestedBy: client.users.resolve(song.requestedBy),
                            queryType: QueryType.SPOTIFY_SONG,
                            source: 'spotify',
                            playlist: {
                                title : playlistData[parseInt(collected.values[0])].name,
                                thumbnail :playlistData[parseInt(collected.values[0])].images[0].url ,
                                source : 'spotify',
                                tracks :  arr ,
                            }
                        });
                    tracks.push(track)
                    }

                    const playlist = player.createPlaylist({
                        author: { name: tracks[0].author, url: tracks[0].url },
                        description: '',
                        source: 'spotify',
                        thumbnail: playlistData[parseInt(collected.values[0])].images[0].url,
                        title: playlistData[parseInt(collected.values[0])].name,
                        tracks,
                        type: 'playlist',
                        url: tracks[0].url
                    });
                    
                    const queue = useQueue(interaction.guild.id)
                    if(!queue) {
                        // joinVoiceChannel({
                        //     channelId: interaction.member.voice.channel.id,
                        //     guildId: interaction.channel.guild.id,
                        //     adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
                        // });
                        const queue = player.nodes.create(interaction.guild, {
                            metadata: {interaction : interaction},
                            volume: 50,
                            selfDeaf: true,
                            leaveOnEmpty: true,
                            leaveOnEmptyCooldown: 10000,
                            leaveOnEnd: true,
                            leaveOnEndCooldown: 10000,
                            ytdlOptions: {
                                quality: "highest",
                                filter: "audioonly",
                                highWaterMark: 1 << 25,
                                dlChunkSize: 0,
                                requestOptions: {
                                    headers: { cookie:client.config.var.yt_cookie },
                                },
                            }
                        })
                     await queue.connect(interaction.member.voice.channel);
        
                     const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${playlistData[parseInt(collected.values[0])].name}](${playlistData[parseInt(collected.values[0])].external_urls.spotify}).\n\nKindly be aware that this playlist is set to private, which limits the retrieval of songs to a maximum of 100 at a time.`);
            
                     queue.addTrack(playlist)
                     queue.node.play()
                     collected.editReply({ embeds: [loadingTrack], components: [] }).then((msg) => setTimeout(() => msg.delete(), 5000));
                  } else {
                    const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${playlistData[parseInt(collected.values[0])].name}](${playlistData[parseInt(collected.values[0])].external_urls.spotify}).\n\nKindly be aware that this playlist is set to private, which limits the retrieval of songs to a maximum of 100 at a time.`);
                    collected.editReply({ embeds: [loadingTrack], components: [] }).then((msg) => setTimeout(() => msg.delete(), 5000));
                    queue.addTrack(playlist.tracks)
                  } 
                    return;
                }
                
                // Search playlist!
                const query = playlistData[parseInt(collected.values[0])].external_urls.spotify
                const searchResult = await player.search(query, {
                    requestedBy: interaction.member,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST,
                });

                // No results!
                const no_result = new EmbedBuilder().setColor("#2f3136").setDescription(`:mag:⠀ | ⠀No results found. This might be a spotify wrapped or blend!`);
                // if (!searchResult || !searchResult.tracks.length) return collected.editReply({ embeds: [no_result] ,components : [], ephemeral: true }).then((message) => setTimeout(() => message.delete(), 20000));
                if (!searchResult || !searchResult.tracks.length) {
                    const noVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Join a voice channel first!`);
                    const diffVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`);
                    if (!interaction.member.voice.channel) return collected.followUp({ embeds: [noVoice],components : [], ephemeral: true });
                    if (interaction.guild.members.me.voice.channel &&interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return collected.followUp({ embeds: [diffVoice],components : [], ephemeral: true });
                    const loading  = new EmbedBuilder().setColor("#2f3136").setDescription('<a:loading:889018179471441941>⠀ | ⠀Loading your playlist');
                    collected.editReply({embeds : [loading] , components : []})

                    const pvt_playlist = await axios.get(playlistData[parseInt(collected.values[0])].href ,{
                        headers : {
                            "Content-Type" : "application/x-www-form-urlencoded",
                            "Authorization" : `Bearer ${access_token}`
                        }
                    })
                    const urls = pvt_playlist.data.tracks.items.map((item) => item.track.external_urls.spotify)
                    let arr = []
                    for (i = 0; i < urls.length; i++) {
                        const search = await player.search(urls[i], {
                            requestedBy: interaction.member,
                            searchEngine: QueryType.SPOTIFY_SONG,
                        });
                        arr.push(search.tracks[0].raw);
                    };
                    const tracks = [];
                    for (const song of arr) {
                        const track = new Track(interaction.client, {
                            author: song.author,
                            description: song.description || song.title,
                            duration: song.duration,
                            thumbnail: song.thumbnail,
                            title: song.title,
                            url: song.url,
                            views: song.views,
                            requestedBy: client.users.resolve(song.requestedBy),
                            queryType: QueryType.SPOTIFY_SONG,
                            source: 'spotify',
                            playlist: {
                                title : playlistData[parseInt(collected.values[0])].name,
                                thumbnail :playlistData[parseInt(collected.values[0])].images[0].url ,
                                source : 'spotify',
                                tracks :  arr ,
                            }
                        });
                    tracks.push(track)
                    }

                    const playlist = player.createPlaylist({
                        author: { name: tracks[0].author, url: tracks[0].url },
                        description: '',
                        source: 'spotify',
                        thumbnail: playlistData[parseInt(collected.values[0])].images[0].url,
                        title: playlistData[parseInt(collected.values[0])].name,
                        tracks,
                        type: 'playlist',
                        url: tracks[0].url
                    });
                    
                    const queue = useQueue(interaction.guild.id)
                    if(!queue) {
                        // joinVoiceChannel({
                        //     channelId: interaction.member.voice.channel.id,
                        //     guildId: interaction.channel.guild.id,
                        //     adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
                        // });
                        const queue = player.nodes.create(interaction.guild, {
                            metadata: {interaction : interaction},
                            volume: 50,
                            selfDeaf: true,
                            leaveOnEmpty: true,
                            leaveOnEmptyCooldown: 10000,
                            leaveOnEnd: true,
                            leaveOnEndCooldown: 10000,
                            ytdlOptions: {
                                quality: "highest",
                                filter: "audioonly",
                                highWaterMark: 1 << 25,
                                dlChunkSize: 0,
                                requestOptions: {
                                    headers: { cookie:client.config.var.yt_cookie },
                                },
                            }
                        })
                     await queue.connect(interaction.member.voice.channel);
        
                     const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${playlistData[parseInt(collected.values[0])].name}](${playlistData[parseInt(collected.values[0])].external_urls.spotify}).\n\nKindly be aware that this playlist is set to private, which limits the retrieval of songs to a maximum of 100 at a time.`);
            
                     queue.addTrack(playlist)
                     queue.node.play()
                     collected.editReply({ embeds: [loadingTrack], components: [] }).then((msg) => setTimeout(() => msg.delete(), 5000));
                  } else {
                    const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${playlistData[parseInt(collected.values[0])].name}](${playlistData[parseInt(collected.values[0])].external_urls.spotify}).\n\nKindly be aware that this playlist is set to private, which limits the retrieval of songs to a maximum of 100 at a time.`);
                    collected.editReply({ embeds: [loadingTrack], components: [] }).then((msg) => setTimeout(() => msg.delete(), 5000));
                    queue.addTrack(playlist.tracks)
                  } 
                    return;
                }
                // Not in voice or Different voice channel
                const noVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046>⠀ | ⠀Join a voice channel first!`);
                const diffVoice = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:warn:889018313143894046> ⠀|⠀ You are in a different voice channel`);
                if (!interaction.member.voice.channel) return collected.followUp({ embeds: [noVoice],components : [], ephemeral: true });
                if (interaction.guild.members.me.voice.channel &&interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return collected.followUp({ embeds: [diffVoice],components : [], ephemeral: true });

                // joining voice channel manually!
                joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.channel.guild.id,
                    adapterCreator: interaction.channel.guild.voiceAdapterCreator,  
                  });
                
                  player.play(interaction.member.voice.channel.id, searchResult, {
                    requestedBy: interaction.user,
                      nodeOptions: {
                        metadata:{
                          interaction : interaction,
                         },
                        volume: 50,
                        selfDeaf: true,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 10000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 10000,
                        ytdlOptions: {
                          quality: "highest",
                          filter: "audioonly",
                          highWaterMark: 1 << 25,
                          dlChunkSize: 0,
                          requestOptions: {
                            headers: {
                              cookie:client.config.var.yt_cookie ,
                            },
                          },
                  },
                      },
                  });
                  const loadingTrack = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:loading:889018179471441941>⠀ | ⠀Loading your playlist : [${playlistData[parseInt(collected.values[0])].name}](${playlistData[parseInt(collected.values[0])].external_urls.spotify})`);
                  collected.editReply({embeds : [loadingTrack] ,components : []}).then((message) => setTimeout(() => message.delete(), 20000))
            }
        });
    }
  },
};


