const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List and usage of commands")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(
          "Specify command to see detailed explanation of each command"
        )
        .setRequired(false)
        .setAutocomplete(true)
    ),
  category: "Infos",
  utilisation: "/help <command name>",

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = client.slashCommands.filter((x) => x.category != "Staff").map((x) =>  x.data.name)
    const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0,25);
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })),
    );
  },


  async execute(client, interaction) {
    if (!interaction.options.get("command")) {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("select")
          .setPlaceholder("Choose Category")
          .addOptions([
            {
              label: "Utility", 
              description: "Utility commands",
              value: "Utility",
              emoji: "<a:utility:889018312514752532>",
            },
            {
              label: "Music",
              description: "Music commands",
              value: "Music",
              emoji: "<a:music:900715679722913852>",
            },
            {
              label: "Filters",
              description: "Audio effects list",
              value: "Filters",
              emoji: "<:filter:900717998308991036>",
            },
          ])
      );

      let embed = new EmbedBuilder()
        .setTitle("<:help1:900708695829250120> • HELP MENU")
        .setDescription(
          "Unleash the rhythm and elevate your Discord server with **Beats**, the ultimate music bot that brings harmony, energy, and a symphony of melodies to your online community. \n\n**[Website](https://beatsbot.in)**  |  **[Commands](https://dashboard.beatsbot.in/commands)**  |  **[Invite](https://discord.com/api/oauth2/authorize?client_id=886801342239211522&permissions=2184529984&scope=bot%20applications.commands)**  |  **[Support](https://discord.gg/JRRZmdFGmq)**\n\nChoose Command Category.⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
        )
        .setColor("#2f3136")
        .setThumbnail(
          "https://cdn.beatsbot.in/Beatstr.png"
        );

      const msg = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });

      filters = [
        "Bassboost",
        "8D",
        "Vaporwave",
        "Nightcore",
        "Normalizer",
        "Surrounding",
        "Gate",
        "Phaser",
        "Treble",
        "Tremolo",
        "Vibrato",
        "Reverse",
        "Karaoke",
        "Flanger",
        "Mcompand",
        "Pulsator",
        "Subboost",
        "Mstlr",
        "Compressor",
        "Softlimiter",
        "Chorus",
        "Fadein",
      ];
      const filterlist1 = filters.map((x) => "`" + x + "`").join(" • ");
      const infos = client.slashCommands
        .filter((x) => x.category == "Infos")
        .map((x) => "`" + x.data.name + "`")
        .join(" • ");
      const music = client.slashCommands
        .filter((x) => x.category == "Music")
        .map((x) => "`" + x.data.name + "`")
        .join(" • ");

      const embed1 = new EmbedBuilder()
        .setTitle("<:help1:900708695829250120> • HELP MENU")
        .setColor("#2f3136")
        .setThumbnail(
          "https://cdn.beatsbot.in/Beatstr.png"
        )
        .setDescription(
          `\`\`\`yaml
Use /help <command> to know more⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
For eg: /help invite\`\`\``
        )
        .addFields({
          name: "<a:utility:889018312514752532> • UTILITY COMMANDS",
          value: `\u200b\n${infos}`,
        });

      const embed2 = new EmbedBuilder()
        .setTitle("<:help1:900708695829250120> • HELP MENU")
        .setColor("#2f3136")
        .setThumbnail(
          "https://cdn.beatsbot.in/Beatstr.png"
        )
        .setDescription(
          `\`\`\`yaml
Use /help <command> to know more
For eg: /help play\`\`\`\n\n`
        )
        .addFields({
          name: "<a:music:900715679722913852> • MUSIC COMMANDS",
          value: `\u200b\n${music}`,
        });

      const filterlist = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("<:help1:900708695829250120> • HELP MENU")
        .setThumbnail(
          "https://cdn.beatsbot.in/Beatstr.png"
        )
        .setDescription(
          `\`\`\`yaml
Use /filter [filter name] to add a filter.
For eg: /filter 8D\`\`\`\n\n`
        )
        .addFields({
          name: "<:filter:900717998308991036> • AUDIO FILTERS\n",
          value: `\u200b\n${filterlist1}`,
        });

      const collector = msg.createMessageComponentCollector({
        max: 5,
        idle: 15000,
        componentType: 3,
      });

      collector.on("collect", async (collected) => {
        const value = collected.values[0];
        await collected.deferUpdate();
        if (collected.user.id !== interaction.user.id)
          return collected.followUp({
            embeds : [new EmbedBuilder().setColor("#2f3136").setDescription(`<:huh:897560243624640563>  |  That command wasn't for you`)],
            ephemeral: true,
          });
        if (value === "Utility") {
          await collected.editReply({ embeds: [embed1], ephemeral: false });
        }

        if (value === "Music") {
          await collected.editReply({ embeds: [embed2], ephemeral: false });
        }

        if (value === "Filters") {
          await collected.editReply({ embeds: [filterlist], ephemeral: false });
        }
      });

      const disabledrow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("sed")
          .setPlaceholder("Selection timed out")
          .setDisabled(true)
          .addOptions([
            {
              label: "Utility",
              description: "Utility commands",
              value: "Utility",
              emoji: "<a:utility:889018312514752532>",
            },
          ])
      );
      collector.on("end", (async) => {
        interaction.editReply({ components: [disabledrow]});
      });
    } else {
      const query = interaction.options.get("command").value;
      const cmd = await client.slashCommands.get(query.toLowerCase());
      const nohelp = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          `<a:warn:889018313143894046>⠀ | ⠀ This is not a command`
        );
      if (!cmd) return interaction.reply({ embeds: [nohelp], ephemeral: true });

      const helpeach = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `${cmd.data.name}`,
          iconURL: interaction.user.avatarURL(),
        })
        .setDescription(`\`\`\`yaml\n${cmd.data.description}\`\`\``)
        .setThumbnail(
          "https://cdn.beatsbot.in/Beatstr.png"
        )
        .setFields(
          { name: "Category", value: `\`${cmd.category}\``, inline: true },
          { name: "Usage", value: `\`${cmd.utilisation}\``, inline: true },
          {
            name: "\u200B",
            value: `**Having issues?**\n Join [support server](https://beatsbot.in/support)`,
          }
        );
      interaction.reply({ embeds: [helpeach] });
    }
  },
};
