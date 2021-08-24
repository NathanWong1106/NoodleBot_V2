const AudioObject = require("../objects/AudioObject");
const { createAudioResource, demuxProbe, AudioResource, StreamType } = require("@discordjs/voice");
const { createReadStream } = require("fs")
const ytdl = require("ytdl-core-discord");
const ytsr = require("ytsr");

class YouTubeQueryHandler {
    /**
     * Attempts to get a YouTube video from the query and return an Opus `AudioResource` using `ytdl-core-discord`
     * @param {String} query either a search query or a valid YouTube URL
     * @returns {AudioResource<AudioObject> | null} audio resource if successful, else null
     * 
     * TODO: perhaps instead of null an error message is sent | this method takes far too long, see what we can do to optimize
     */
    static getAudioResourceFromQuery = async (query) => {
        if(ytdl.validateURL(query)) {
            //Is a valid YouTube URL
            const info = await ytdl.getBasicInfo(query);

            //Do not play live content
            if(info.videoDetails.isLiveContent) return null;

            return await this.#createAudioResourceFromInfo(info);

        }
        else{
            //Is a search
            const res = await ytsr(query, {
                limit: 1
            });
            
            if(res.results === 0) return null;

            const info = await ytdl.getBasicInfo(res.items[0].url);

            //Do not play live content
            if(info.videoDetails.isLiveContent) return null;
            
            return await this.#createAudioResourceFromInfo(info);
        }
    }

    /**
     * With info from `ytdl`, returns an `AudioResource` with relevant metadata
     * @param {import("ytdl-core").videoInfo} info 
     */
    static #createAudioResourceFromInfo = async info => {
        const vd = info.videoDetails;
        const readable = await ytdl(vd.video_url);

        return createAudioResource(readable, {
            inputType: StreamType.Opus,
            metadata: new AudioObject(
                    vd.title,
                    vd.video_url,
                    vd.thumbnails[0].url,
                    vd.lengthSeconds,
                    vd.ownerChannelName
                )
        });
    }
}

module.exports = YouTubeQueryHandler;