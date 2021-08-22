/**
 * All relevant fields of a clip
 */
class AudioObject {
    constructor(name, url, thumbnailURL, durationSeconds, channelName) {
        this.name = name;
        this.url = url;
        this.thumbnailURL = thumbnailURL,
        this.durationSeconds = durationSeconds;
        this.channelName = channelName;
    }
}

module.exports = AudioObject;