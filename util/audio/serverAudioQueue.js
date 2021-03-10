const { VoiceConnection } = require("discord.js");
const MediaItem = require("./mediaItem");
const ytdl = require("ytdl-core-discord");

class ServerAudioQueue {
  /**
   * @param {VoiceConnection} connection
   */
  constructor(connection) {
    this.queue = [];
    this.isLoopingItem = false;
    this.isLoopingQueue = false;
    this.isPlaying = false;
    this.connection = connection;
    this.dispatcher = null;
  }

  static GlobalQueues = new Map();

  /**
   * Enqueues a track to the specified server
   * @param {VoiceConnection} connection
   * @param {MediaItem} mediaItem
   */
  static enqueue = (serverID, mediaItem) => {
    if (this.GlobalQueues.has(serverID)) {
      this.GlobalQueues.get(serverID).queue.push(mediaItem);
    }

    const serverQueue = this.GlobalQueues.get(serverID);
    if (!serverQueue.isPlaying) {
      serverQueue.dispatchQueue();
    }
  };

  /**
   * Adds a connection to the global queue
   * @param {VoiceConnection} connection
   */
  static addConnection = (connection) => {
    this.GlobalQueues.set(
      connection.channel.guild.id,
      new ServerAudioQueue(connection)
    );
  };

  /**
   * Disconnects the VC connection in the server and removes the connection from the global queue
   * @param {string} serverID
   */
  static removeConnection = (serverID) => {
    this.GlobalQueues.get(serverID).connection.disconnect();
    this.GlobalQueues.delete(serverID);
  };

  /**
   * Plays all the audio in the queue
   */
  dispatchQueue = async () => {
    if (this.queue.length != 0) {
      const item = this.queue[0];
      this.isPlaying = true;

      this.dispatcher = this.connection.play(await ytdl(item.url), {
        type: "opus",
      });

      this.dispatcher.once("finish", () => {
        if (!this.isLoopingItem) {
          if (this.isLoopingQueue) {
            this.queue.push(this.queue.shift());
          } else {
            this.queue.shift();
          }
        }
        this.dispatchQueue();
      });
    } else {
      this.dispatcher = null;
      this.isPlaying = false;
      this.isLoopingItem = false;
    }
  };
}

module.exports = ServerAudioQueue;
