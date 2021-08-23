const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');

const NAME = "loop";
const DESC = "Loop the current song";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
    Condition.voice.hasAudioResource
];
const DATA = new SlashCommandBuilder();

const execute = async (interaction) => {
    const audio = NoodleBot.guildStates.get(interaction.guildId).audio
    audio.isLoopingOne = !audio.isLoopingOne;

    if(audio.isLoopingOne){
        interaction.reply(`Looping ${audio.currentResource.metadata.name}`);
    }
    else{
        interaction.reply(`Stopped looping ${audio.currentResource.metadata.name}`);
    }
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
