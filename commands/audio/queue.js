const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');

const NAME = "queue";
const DESC = "Show songs currently in the queue";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
];
const DATA = new SlashCommandBuilder()
    .addIntegerOption(option => 
        option.setName("page")
            .setDescription("Page of the queue to view. Defaults to 1st page")
            .setRequired(false)
    );

const execute = async (interaction) => {
    let page = interaction.options.getInteger("page") ?? 1;

    if(page < 1){
        await interaction.reply("Page number must be a positive integer greater than 0");
        return;
    }

    const audio = NoodleBot.guildStates.get(interaction.guildId).audio;
    if(audio.queue.length === 0 && audio.currentResource === null){
        await interaction.reply("Nothing is playing or in queue");
        return;
    }
    
    const description = audio.getQueuePagination(page);

    const embed = {
        author: {
            name: "Queue",
        },
        title: `Currently Playing: ${audio.currentResource.metadata.displayName}`,
        url: audio.currentResource.metadata.url,
        thumbnail: {
            url: audio.currentResource.metadata.thumbnailURL
        },
        description: description ?? "This page does not exist",
        fields: [
            {
                name: "Looping One",
                value: audio.isLoopingOne ? "Yes" : "No",
                inline: true
            },
            {
                name: "Looping Queue",
                value: audio.isLoopingQueue ? "Yes" : "No",
                inline: true
            }
        ]
    }

    await interaction.reply({embeds: [embed]})
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
