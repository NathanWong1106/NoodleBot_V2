const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require("../../bot.js");

const NAME = "join";
const DESC = "Invite NoodleBot into your voice channel";
const CONDITIONS = [
    Condition.voice.userInVC, 
    Condition.operators.not(Condition.voice.botIsConnected, "The bot is already connected to another voice channel")
];
const DATA= new SlashCommandBuilder();

const execute = async (interaction) => {
    try{
        await NoodleBot.guildStates.get(interaction.guildId).audio.connect(interaction.member.voice.channel);
        await interaction.reply("joined");
    } catch (err) {
        console.log(err);
        await interaction.reply("Damn I messed up");
    }
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
