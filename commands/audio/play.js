const { Message } = require("discord.js");
const ytsr = require("ytsr");
const MediaItem = require("../../util/audio/mediaItem");
const ServerAudioQueue = require("../../util/audio/serverAudioQueue");
const Tokenizer = require("../../util/tokenizer");

module.exports = {
  names: ["play"],
  type: require("../../handlers/commandTypes.json").AUDIO,

  /**
   * @param {Message} message
   * @param {Array<string>} tokens
   */
  async execute(message, tokens) {
    const query = Tokenizer.concat(tokens);

    //TODO: validate the query for a video or playlist before assuming it's a search
    let results = await ytsr(query, { limit: 1 });
    let top = results.items[0];

    const thumbnailURL = `https://img.youtube.com/vi/${top.videoID}/hqdefault.jpg`;
    const mediaItem = new MediaItem(
      top.title,
      top.url,
      thumbnailURL,
      top.author.name,
      top.length,
      message.author.id
    );

    ServerAudioQueue.enqueue(message.guild.id, mediaItem);
  },
};
