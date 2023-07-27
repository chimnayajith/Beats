const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder , AttachmentBuilder} = require("discord.js");
const voters = require("../models/lifetimeVotes")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test command"),
    category: "Staff",

  async execute(client, interaction) {
    
    },
};

