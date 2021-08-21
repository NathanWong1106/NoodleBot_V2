const { VoiceConnection, VoiceConnectionStatus, AudioPlayer,joinVoiceChannel, createAudioPlayer, entersState } = require("@discordjs/voice");
const { VoiceChannel } = require("discord.js");
//NOTE: With Discord.js v13 the audio player has changed dramatically
//Refer to: https://discordjs.guide/voice/

/**
 * Fields and functions to play audio to a voice connection
 */
class AudioHandler {
    /**
     * Connection to a voice channel. If null then the bot is disconnected
     * @type {VoiceConnection}
     */
    connection = null;

    /**
     * The player can be broadcast to multiple VoiceConnections using connection.subscribe()
     * We'll only use this for one specific connection in the guild
     * @type {AudioPlayer}
     */
    player = null;

    queue = [];
    isPlaying = false;
    isLoopingOne = false;
    isLoopingQueue = false;

    /**
     * @param {VoiceConnection} connection 
     */
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * @param {VoiceChannel} channel 
     */
    connect = async(channel) => {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.connection.on(VoiceConnectionStatus.Disconnected, this.onDisconnect);
        
        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);
    }

    disconnect = async() => {
        //this should trigger discordjs disconnected event
        this.connection.disconnect();
    }

    //https://discordjs.guide/voice/voice-connections.html#handling-disconnects
    //3 possible scenarios here
    onDisconnect = async(oldState, newState) => {
        /**
         * This code from the discordjs guide is a workaround to differentiate actual disconnects from resumable/reconnectable disconnects
         * @see https://discordjs.guide/voice/voice-connections.html#handling-disconnects
         */
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            this.connection.destroy();
            this.connection = null;

            //Stop the player then set null for GC
            this.player.stop();
            this.player = null;
        }
    }
}

module.exports = AudioHandler;