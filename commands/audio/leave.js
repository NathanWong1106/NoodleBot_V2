const { Message } = require("discord.js");
const ServerAudioQueue = require("../../util/audio/serverAudioQueue");

module.exports = {
  names: ["leave"],
  type: require("../../handlers/commandTypes.json").AUDIO,

  /**
   * @param {Message} message
   * @param {Array<string>} tokens
   */
  async execute(message, tokens) {
    ServerAudioQueue.removeConnection(message.guild.id);
  },
};
