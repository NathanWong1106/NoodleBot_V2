const maxNameChars = 50;

/**
 * All relevant fields of a clip.
 * 
 * Stored as metadata of an `AudioResource`
 */
class AudioObject {
    constructor(name, url, thumbnailURL, durationSeconds, channelName) {
        /**
         * @type {String}
         */
        this.name = name;
        this.displayName = this.name.length > maxNameChars ? this.name.slice(0,37) + "..." : this.name;
        this.url = url;
        this.thumbnailURL = thumbnailURL,
        this.durationSeconds = durationSeconds;
        this.channelName = channelName;
    }

    /**
     * Returns the string representation of the AudioObject in queue
     */
    getQueueString = () => {
        return `[${this.displayName}](${this.url})`;
    }
}

module.exports = AudioObject;