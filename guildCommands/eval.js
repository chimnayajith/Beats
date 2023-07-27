const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate the code in javascript")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("code block to evaluate")
        .setRequired(true)
    ),
  category: "Staff",
  utilisation: "/eval <code>",

  async execute(client, interaction) {
    let code = interaction.options.get("code").value;
    const embed = new EmbedBuilder();

    try {
      let evaled = await eval(code);

      if (evaled.constructor.name === `Promise`) {
        output = `📤 Output (Promise)`;
      } else {
        output = `📤 Output`;
      }
      if (evaled.length > 800) {
        evaled = evaled.substring(0, 800) + `...`;
      }
      embed.addFields({name : `📥 Input`, value : `\`\`\`\n${code}\n\`\`\``});
      embed.addFields({name : output, value : `\`\`\`js\n${evaled}\n\`\`\``});
      embed.setColor("Random");
      embed.addFields({name : `Status`, value : `Success`});
      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(e.stack);
      embed.addFields({name : `📥 Input`, value : `\`\`\`\n${code}\n\`\`\``});
      embed.addFields({name : `📤 Output`, value : `\`\`\`js\n${e}\n\`\`\``});
      embed.addFields({name : `Status`, value : `Failed`});
      embed.setColor("Random");
      return interaction.reply({ embeds: [embed] });
    }
  },
};