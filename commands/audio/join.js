const { Message } = require("discord.js");
const ServerAudioQueue = require("../../util/audio/serverAudioQueue");

module.exports = {
  names: ["join"],
  type: require("../../handlers/commandTypes.json").AUDIO,

  /**
   * @param {Message} message
   * @param {Array<string>} tokens
   */
  async execute(message, tokens) {
    try {
      const serverQueue = ServerAudioQueue.GlobalQueues.get(
        message.member.guild.id
      );

      if (
        serverQueue &&
        serverQueue.connection.channel.id === message.member.voice.channel.id
      ) {
        message.channel.send("I'm already in your voice channel");
        return;
      }

      const vChannel = message.member.voice.channel;
      const connection = await vChannel.join();
      ServerAudioQueue.addConnection(connection);
    } catch (err) {
      message.channel.send(
        "There was a problem connecting to your voice channel"
      );
    }
  },
};
