const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');

const NAME = "unpause";
const DESC = "Continues where the song left off when paused";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
    Condition.voice.hasAudioResource
];
const DATA = new SlashCommandBuilder();

const execute = async (interaction) => {
    NoodleBot.guildStates.get(interaction.guildId).audio.unpause();
    await interaction.reply("Resumed");
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
