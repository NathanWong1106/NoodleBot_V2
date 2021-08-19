const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../objects/Command");

const NAME = "ping";
const DESC = "Ping Pong"

const data = new SlashCommandBuilder();

const execute = async (interaction) => {
    await interaction.reply("pong");
}

module.exports = new Command(NAME, DESC, data, execute);
