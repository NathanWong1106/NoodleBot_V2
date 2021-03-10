const { Message } = require("discord.js");
const ServerAudioQueue = require("../../util/audio/serverAudioQueue");

// Handle correctness of audio commands from the user here
class AudioCommandHandler {
  static name = require("../commandTypes.json").AUDIO;
  /**
   * @param {Object} command
   * @param {Message} message
   * @param {Array<string>} tokens
   */
  static execute = async (command, message, tokens) => {
    //Why would you use an audio command outside of a vc...
    if (!message.member.voice.channel) {
      message.channel.send("Please connect to a voice channel");
      return;
    }

    const serverQueue = ServerAudioQueue.GlobalQueues.get(message.guild.id);

    //If the bot is connected, then the user must be connected to the same channel
    if (
      serverQueue &&
      serverQueue.connection.channel.id !== message.member.voice.channel.id
    ) {
      message.channel.send("I'm connected to a different channel");
      return;
    }

    //terrible solution... TODO: make a better solution for this case?
    //We want to reject any audio commands when we aren't connected unless it's a join command
    if (!serverQueue && command.names[0] != "join") {
      message.channel.send("I'm not connected to a voice channel.");
      return;
    }

    command.execute(message, tokens);
  };
}

module.exports = AudioCommandHandler;
