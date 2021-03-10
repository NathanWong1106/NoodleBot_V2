const { Message } = require("discord.js");

module.exports = {
  names: ["test", "t"],
  type: require("../../handlers/commandTypes.json").GENERIC,

  /**
   * @param {Message} message
   * @param {Array<string>} tokens
   */
  execute(message, tokens) {
    message.channel.send("henlo");
  },
};
