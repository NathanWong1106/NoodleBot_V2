const AudioHandler = require("../util/AudioHandler");

/**
 * The state of the bot in a guild
 */
class GuildState {
    guildID = null;
    audio = new AudioHandler(null);

    constructor(guildID){
        this.guildID = guildID;
    }
}

module.exports = GuildState;