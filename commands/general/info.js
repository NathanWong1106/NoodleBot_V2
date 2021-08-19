const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");

const NAME = "info";
const DESC = "Get Info"

const data = new SlashCommandBuilder();

const execute = async (interaction) => {
    await interaction.reply("This is a placeholder command");
}

module.exports = new Command(NAME, DESC, data, execute);