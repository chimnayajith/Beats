
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const pretty = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the list of all songs in queue"),
  voiceChannel: true,
  category: "Music",
  utilisation: "/queue",

  async execute(client, interaction) {
    const queue = player.nodes.get(interaction.guild.id);
    const embed3 = new EmbedBuilder()
    .setColor("#2f3136")
    .setDescription(`**:mute:⠀ | ⠀No music currently playing**`);
  if (!queue)
    return interaction.reply({ embeds: [embed3], ephemeral: true });

    const length = queue.estimatedDuration;
    const duration = pretty(length);

    const methods = ["", "*Song looped*", "*Queue looped*"];

   

    const autoplay = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**<a:warn:889018313143894046>⠀ | ⠀Autoplay Mode enabled**`);
    if (queue.repeatMode == 3)
      return interaction.reply({ embeds: [autoplay], ephemeral: true });

    const embed4 = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`**<a:warn:889018313143894046> ⠀|⠀ Only one song in the queue**`);
    if (!queue.tracks.toArray()[0])
      return interaction.reply({ embeds: [embed4], ephemeral: true });

    let pages = [];
    let current = 0;

    const total = Math.ceil(queue.tracks.size / 10);

    for (let i = 0; i < queue.tracks.size; i += 10) {
      let queuepage = queue.tracks.toArray()
        .map(
          (track, i) =>
            `${i + 1}) [${track.title}](${track.url}) \`[${
              track.duration
            }]\` - [${track.requestedBy}]`
        )
        .slice(i, i + 10)
        .join("\n\n");
      const page = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle(
          `Server Queue⠀|⠀${interaction.guild.name}\n${
            methods[queue.repeatMode]
          }\nQueue Duration : ${duration}`
        )
        .setThumbnail(
          interaction.guild.iconURL({
            dynamic: false,
            size: 2048,
            format: "png",
          })
        )
        .setDescription(
          `**Currently Playing :** \`\`\`yaml\n${queue.currentTrack
            .title}\`\`\`\n **Upcoming tracks(${queue.tracks.size})\n**\n${queuepage}`
        )
        .setFooter({ text: `Page : ${Math.ceil(i / 10) + 1}/${total}` });
      pages.push(page);
    }

    const ettomleft = new ButtonBuilder()
      .setEmoji("<:allleft:907281330482585671>")
      .setStyle(2)
      .setCustomId("ettom_left");
    const prev = new ButtonBuilder()
      .setEmoji("<:left_arroe:901325048189698078>")
      .setStyle(2)
      .setCustomId("prev_page");
    const stop = new ButtonBuilder()
      .setEmoji(`⛔`)
      .setStyle(4)
      .setCustomId("cancel_btn");
    const next = new ButtonBuilder()
      .setEmoji(`<:right_arroe:901325048261005322>`)
      .setStyle(2)
      .setCustomId("next_page");
    const ettomright = new ButtonBuilder()
      .setEmoji("<:allright:907281330079944745>")
      .setStyle(2)
      .setCustomId("ettom_right");
    const dettomleft = new ButtonBuilder()
      .setEmoji("<:allleft:907281330482585671>")
      .setStyle(2)
      .setCustomId("ettom_left")
      .setDisabled();
    const dprev = new ButtonBuilder()
      .setEmoji("<:left_arroe:901325048189698078>")
      .setStyle(2)
      .setCustomId("prev_page")
      .setDisabled();
    const dstop = new ButtonBuilder()
      .setEmoji(`⛔`)
      .setStyle(4)
      .setCustomId("cancel_btn")
      .setDisabled();
    const dnext = new ButtonBuilder()
      .setEmoji(`<:right_arroe:901325048261005322>`)
      .setStyle(2)
      .setCustomId("next_page")
      .setDisabled();
    const dettomright = new ButtonBuilder()
      .setEmoji("<:allright:907281330079944745>")
      .setStyle(2)
      .setCustomId("ettom_right")
      .setDisabled();

    const row = new ActionRowBuilder().addComponents([
      ettomleft,
      prev,
      stop,
      next,
      ettomright,
    ]);
    const row1 = new ActionRowBuilder().addComponents([
      dettomleft,
      dprev,
      stop,
      next,
      ettomright,
    ]);
    const row2 = new ActionRowBuilder().addComponents([
      ettomleft,
      prev,
      stop,
      dnext,
      dettomright,
    ]);
    const drow = new ActionRowBuilder().addComponents([
      dettomleft,
      dprev,
      dstop,
      dnext,
      dettomright,
    ]);

    const msg = await interaction.reply({
      embeds: [pages[current]],
      components: [row1],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: 2,
    });
    collector.on("collect", async (collected) => {
      if (collected.customId === "next_page") {
        await collected.deferUpdate();
        if (current < pages.length - 1) {
          current += 1;
          if (current == pages.length - 1) {
            await collected.editReply({
              embeds: [pages[current]],
              components: [row2],
            });
          } else {
            await collected.editReply({
              embeds: [pages[current]],
              components: [row],
            });
          }
        }
      }
      if (collected.customId === "prev_page") {
        await collected.deferUpdate();
        if (current !== 0) {
          current -= 1;
          if (current == 0) {
            await collected.editReply({
              embeds: [pages[current]],
              components: [row1],
            });
          } else {
            await collected.editReply({
              embeds: [pages[current]],
              components: [row],
            });
          }
        }
      }
      if (collected.customId === "ettom_left") {
        current = 0;
        await collected.deferUpdate();
        await collected.editReply({
          embeds: [pages[current]],
          components: [row1],
        });
      }

      if (collected.customId === "ettom_right") {
        await collected.deferUpdate();
        current = pages.length - 1;
        await collected.editReply({
          embeds: [pages[current]],
          components: [row2],
        });
      }

      if (collected.customId === "cancel_btn") {
        await collected.deferUpdate();
        collector.stop();
        await collected.editReply({ components: [drow] });
      }
    });
  },
};
