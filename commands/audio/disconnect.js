const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require("../../bot.js");

const NAME = "disconnect";
const DESC = "Disconnect NoodleBot from your voice channel";
const CONDITIONS = [
    Condition.voice.userInVC, 
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC
];
const DATA = new SlashCommandBuilder();

const execute = async (interaction) => {
    try{
        await NoodleBot.guildStates.get(interaction.guildId).audio.disconnect(interaction.member.voice.channel);
        await interaction.reply("disconnected");
    } catch (err) {
        console.log(err);
        await interaction.reply("Damn I messed up");
    }
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
