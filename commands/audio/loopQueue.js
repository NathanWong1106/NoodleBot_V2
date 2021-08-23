const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');

const NAME = "loopqueue";
const DESC = "Loop the queue";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
];
const DATA = new SlashCommandBuilder();

const execute = async (interaction) => {
    const audio = NoodleBot.guildStates.get(interaction.guildId).audio
    audio.isLoopingQueue = !audio.isLoopingQueue;

    if(audio.isLoopingQueue){
        interaction.reply(`Looping queue`);
    }
    else{
        interaction.reply(`Stopped looping queue`);
    }
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
