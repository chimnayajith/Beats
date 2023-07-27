const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , AttachmentBuilder} = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const {Chart , registerables} = require('chart.js');
Chart.register(...registerables);
const analytics = require('../models/analytics');
const commands = require('../models/commandSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("analytics")
    .setDescription("Growth graph")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Choice")
        .addChoices(
          { name: "Server Count", value: "server" },
          { name: "User Count", value: "user" },
          { name: "Command Usage" , value : "command"}
        )
        .setRequired(true)
    ),

  voiceChannel: false,
  vote: false,
  category: "Staff",
  utilisation: "",

  async execute(client, interaction) {

    const input = interaction.options.get("option").value;
    await interaction.deferReply()
    if (input === 'server') {
        const data = await analytics.find({});

        const serverGraph = {};

        data.forEach(obj => {
            const date = obj.timestamp.toLocaleDateString('en-GB');
            const serverCount = obj.serverCount;
    
            if (!serverGraph[date] || serverCount > serverGraph[date]) {
                serverGraph[date] = serverCount;
            }
        });
    
        const uniqueDates = Object.keys(serverGraph).slice(-7);
        const highestServerCounts = Object.values(serverGraph).slice(-7);

        const canvas = createCanvas(800, 600);//server

        const ctx = canvas.getContext('2d');

        const chartConfig = {
            type: 'line',
            data: {
            labels: uniqueDates,
            datasets: [
                {
                label: 'Server Count',
                data: highestServerCounts,
                borderColor: '#23b9c4', //'#e73d7d',
                tension: 0.5 ,
                fill : true,
                backgroundColor: 'rgba(75, 192, 192, 0.4)', // Set fill color
                },
            ],
            },
            options: {
                plugins: {
                  backgroundColor: '#23b9c4', // Set the desired background color
                }
              },
        };

        const chart = new Chart(ctx, chartConfig);

        const chartImage = canvas.toBuffer('image/png');

        const attachment = new AttachmentBuilder(chartImage, { name: 'server.png' });

        const embed = new EmbedBuilder().setColor("#2f3136").setTitle('Server Count Analytics').setImage(`attachment://${attachment.name}`);

        interaction.editReply({embeds : [embed] ,  files : [attachment]})

    } else if (input === 'user'){
        const data = await analytics.find({});

        const userGraph = {};

        data.forEach(obj => {
            const date = obj.timestamp.toLocaleDateString('en-GB');
            const userCount = obj.userCount;
    
            if (!userGraph[date] || userCount > userGraph[date]) {
                userGraph[date] = userCount;
            }
        });
    
        const uniqueDates = Object.keys(userGraph).slice(-7);
        const highestUserCounts = Object.values(userGraph).slice(-7);
        const canvas = createCanvas(800, 600);//user

        const ctx = canvas.getContext('2d');

        const userConfig = {
            type: 'line',
            data: {
            labels: uniqueDates,
            datasets: [
                {
                label: 'User Count',
                data: highestUserCounts,
                borderColor: '#23b9c4', //'#e73d7d',
                tension: 0.5 ,
                
                },
            ],
            },
            options: {
                plugins: {
                  backgroundColor: '#23b9c4', // Set the desired background color
                }
              },
        }

        const chart = new Chart(ctx , userConfig);

        const userImage = canvas.toBuffer('image/png');
    
        const attachment = new AttachmentBuilder(userImage, { name: 'user.png' });

        const embed = new EmbedBuilder().setColor("#2f3136").setTitle('User Count Analytics').setImage(`attachment://${attachment.name}`);

        await interaction.editReply({embeds : [embed] ,  files : [attachment]})

    } else if (input === 'command'){
      const data = await commands.find({} , "_id usageCount")

      data.sort((a, b) => b.usageCount - a.usageCount);
      const commandNames = data.map(item => item._id);
      const usageCounts = data.map(item => item.usageCount);

      const canvas = createCanvas(800, 600);//server

      const ctx = canvas.getContext('2d');

      const chartConfig = {
          type: 'bar',
          data: {
          labels: commandNames,
          datasets: [
              {
              label: 'Usage Count',
              data: usageCounts,
              borderColor: '#23b9c4', //'#e73d7d',
              backgroundColor: 'rgba(75, 192, 192, 0.4)', // Set fill color
              },
          ],
          },
          options: {
              plugins: {
                backgroundColor: '#23b9c4', // Set the desired background color
              }
            },
      };

      const chart = new Chart(ctx, chartConfig);

      const chartImage = canvas.toBuffer('image/png');

      const attachment = new AttachmentBuilder(chartImage, { name: 'server.png' });

      const embed = new EmbedBuilder().setColor("#2f3136").setTitle('Command Usage Analytics').setImage(`attachment://${attachment.name}`);

      interaction.editReply({embeds : [embed] ,  files : [attachment]})
    }
  },
};