require("dotenv").config();
const Discord = require("discord.js");
const CommandHandler = require("./commandHandler");

class NoodleBot {
  static client = new Discord.Client();
  static init = () => {
    CommandHandler.init();

    this.client.on("message", (message) => {
      //temp prefix... ideally we grab the server prefix from db
      if (message.content.startsWith("-")) {
        CommandHandler.executeCommand(message);
      }
    });

    this.client.login(process.env.DISCORD_TOKEN);
  };
}
NoodleBot.init();
module.exports = NoodleBot;
