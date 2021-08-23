const SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const Command = require("../../objects/Command");
const Condition = require("../../objects/Condition");
const NoodleBot = require('../../bot');
const YouTubeQueryHandler = require('../../util/YouTubeQueryHandler');

const NAME = "play";
const DESC = "Add a video from YouTube to the queue";
const CONDITIONS = [
    Condition.voice.userInVC,
    Condition.voice.isConnected, 
    Condition.voice.userInSameVC,
];
const DATA = new SlashCommandBuilder()
    .addStringOption(option => 
        option.setName("query")
            .setDescription("Name or URL of the video you want to play")
            .setRequired(true)
    );

const execute = async (interaction) => {
    const query = interaction.options.getString("query");
    try {
        await interaction.deferReply() //We need to defer reply since YT query may take longer than 3 secs
        
        const audioResource = await YouTubeQueryHandler.getAudioResourceFromQuery(query);

        if(audioResource === null){
            await interaction.editReply(`Unable to add ${query} to the queue`);
            return;
        }

        const audioHandler = NoodleBot.guildStates.get(interaction.guildId).audio;
        audioHandler.enqueue(audioResource);
        await audioHandler.play();

        await interaction.editReply(`Added ${query} to the queue`);
    } catch (err) {
        console.log(err);
        await interaction.editReply(`Unable to add ${query} to the queue`);
    }
}

module.exports = new Command(NAME, DESC, DATA, execute, CONDITIONS);
