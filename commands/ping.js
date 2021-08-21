const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../objects/Command");
const Condition = require("../objects/Condition");

const NAME = "ping";
const DESC = "Ping Pong";
const CONDITIONS = [];
const DATA= new SlashCommandBuilder();

const execute = async (interaction) => {
    await interaction.reply("pong");
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
