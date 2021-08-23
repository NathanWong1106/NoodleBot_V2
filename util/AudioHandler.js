const { VoiceConnection, VoiceConnectionStatus, AudioPlayer, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, AudioResource, StreamType} = require("@discordjs/voice");
const { VoiceChannel } = require("discord.js");
const ytdl = require("ytdl-core-discord");
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

    /**
     * The `AudioResource` currently being played by {@link AudioHandler.player}
     * @type {AudioResource} null if nothing is being played
     */
    currentResource = null;

    /**
     * Queue of clips to play
     * @type {Array<AudioResource>}
     */
    queue = [];
    
    /**
     * Whether the player is unpaused, NOT whether a resource is currently playing.
     * This can be true even when a resource is not playing.
     * To check if a resource is playing see {@link AudioHandler.currentResource}
     */
    isPlaying = true;

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
        this.connection.on(VoiceConnectionStatus.Disconnected, this.#onDisconnect);
        
        this.player = createAudioPlayer();
        this.player.on(AudioPlayerStatus.Idle, this.playNext);
        this.connection.subscribe(this.player);
    }

    disconnect = async() => {
        //this should trigger discordjs disconnected event
        this.connection.disconnect();
    }

    /**
     * Start playing
     */
    play = async() => {
        //Do not start play if paused or currently playing a clip
        if(!this.isPlaying || this.currentResource != null) return;
        
        if(this.queue.length >= 1) {
            await this.#playNextInQueue();
        }
    }

    /**
     * Pause playing
     */
    pause = () => {
        if(this.isPlaying){
            this.isPlaying = !this.player.pause(true);
        }
    }

    unpause = () => {
        if(!this.isPlaying){
            this.isPlaying = this.player.unpause();
        }
    }

    /**
     * Play the next `AudioResource` in the queue.
     * 
     * NOTE: to skip use {@link AudioHandler.skip}
     */
    playNext = async() => {
        if(this.isPlaying && this.queue.length >= 0){
            //prioritize looping one over loopingQueue
            if(this.isLoopingOne){
                this.player.play(await this.#copyAudioResource(this.currentResource));
            }
            else if (this.isLoopingQueue){
                this.queue.push(this.currentResource);
                await this.#playNextInQueue();
            }
            else{
                if(this.queue.length >= 1){
                    await this.#playNextInQueue();
                }
            }
        }
        else if (this.queue.length === 0){
            this.currentResource = null;
        }
    }

    /**
     * Skip is {@link AudioHandler.playNext} but overrides pause if one is applied
     */
    skip = () => {
        if(!this.isPlaying) this.unpause();
        this.playNext();
    }

    /**
     * Add an `AudioResource` to the queue
     * @param {AudioResource} audioResource 
     */
    enqueue = (audioResource) => {
        this.queue.push(audioResource);
    }

    

    //https://discordjs.guide/voice/voice-connections.html#handling-disconnects
    //3 possible scenarios here
    #onDisconnect = async(oldState, newState) => {
        /**
         * This code from the discordjs guide is a workaround to differentiate actual disconnects from resumable/reconnectable disconnects
         * @see https://discordjs.guide/voice/voice-connections.html#handling-disconnects
         */
        try {
            await Promise.race([
                entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            this.connection.destroy();
            this.connection = null;

            //Stop the player then set null for GC
            this.player.stop();
            this.player = null;

            //reset everything else
            this.currentResource = null;
            this.queue = [];
            this.isPlaying = true;
            this.isLoopingOne = false;
            this.isLoopingQueue = false;
        }
    }

    #playNextInQueue = async() => {
        const res = this.queue.shift();
        this.currentResource = await this.#copyAudioResource(res);
        this.player.play(res);
    }

    /**
     * Returns an unplayed duplicate of the given audioResource.
     * 
     * This function exists because audioResources seem to be a one use object.
     * If another option is available this will be refactored.
     * 
     * @param {AudioResource} audioResource 
     * @async asychronous due to loading by `ytdl`
     * @returns {AudioResource} a new copy of the audioResource
     */
    #copyAudioResource = async(audioResource) => {
        return createAudioResource(await ytdl(audioResource.metadata.url), {
            inputType: StreamType.Opus,
            metadata: audioResource.metadata
        });
    }
}

module.exports = AudioHandler;