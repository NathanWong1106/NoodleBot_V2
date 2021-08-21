const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");

const NAME = "info";
const DESC = "Placeholder";
const CONDITIONS = [];
const DATA= new SlashCommandBuilder();

const execute = async (interaction) => {
    await interaction.reply("This is a placeholder function");
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
