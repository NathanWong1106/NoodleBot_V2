class MediaItem {
  constructor(title, url, thumbnailURL, channelName, time, userID) {
    this.title = title;
    this.url = url;
    this.thumbnailURL = thumbnailURL;
    this.channelName = channelName;
    this.time = time;
    this.userID = userID;
  }
}

module.exports = MediaItem;
