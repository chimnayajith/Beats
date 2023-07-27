const db = require('../../models/voteReminder')
const { EmbedBuilder , ActionRowBuilder , ButtonBuilder , ButtonStyle} = require('discord.js')
setInterval(
    async function () {
        const data = await db.find({});
        data.forEach((document) => {
            const nextVoteDate = new Date(document.nextVote).getTime();
            const currentDate = Date.now();

            // if (currentDate > nextVoteDate) {
            //     const embed = new EmbedBuilder()
            //         .setColor("#2f3136")
            //         .setDescription("It's been 12 hours since your last vote for Beats on DBL (Discord Bot List). Don't miss out on the opportunity to unlock all vote-restricted commands and support the growth of Beats.")
            //         .setAuthor({iconURL:client.user.displayAvatarURL() , name : "Beats"})
            //         .setTitle("Vote Reminder!")
            //         .setThumbnail('https://cdn.beatsbot.in/Beats.png')
            //     const row = new ActionRowBuilder().addComponents(
            //         new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://discordbotlist.com/bots/beats-9741/upvote').setLabel("Vote Now!")
            //     )
            //     client.users.fetch(document.userId).then((voter) => {
            //         voter.send({embeds : [embed] , components : [row]}).catch((error) => {})
            //         db.deleteOne({_id : document._id}).then(()=>{})
            //     })
            //   }

        })
    }, 
    60000 // every 60 seconds
);
