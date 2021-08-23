const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');

const NAME = "skip";
const DESC = "Skip to the next song";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
    Condition.voice.hasAudioResource
];
const DATA = new SlashCommandBuilder();

const execute = async (interaction) => {
    NoodleBot.guildStates.get(interaction.guildId).audio.skip();
    await interaction.reply("Skipped");
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
