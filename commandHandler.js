const { Message } = require("discord.js");
const fs = require("fs");
const Tokenizer = require("./util/tokenizer");

class Commands {
  /**
   * Map of all available commands
   */
  static cmds = new Map();
  static handlers = new Map();

  static init = () => {
    this.loadCommands("./commands");
    this.loadCommandHandlers("./handlers");
  };

  static loadCommands = (path) => {
    fs.readdirSync(path).forEach((f) => {
      let fPath = `${path}/${f}`;
      if (fs.lstatSync(fPath).isDirectory()) {
        this.loadCommands(fPath);
      } else if (fPath.endsWith("js")) {
        const command = require(fPath);
        command.names.forEach((alias) => {
          this.cmds.set(alias, command);
        });
      }
    });
  };

  static loadCommandHandlers = (path) => {
    fs.readdirSync(path).forEach((f) => {
      let fPath = `${path}/${f}`;

      if (fs.lstatSync(fPath).isDirectory()) {
        this.loadCommandHandlers(fPath);
      } else if (fPath.endsWith("js")) {
        const handler = require(fPath);
        this.handlers.set(handler.name, handler);
      }
    });
  };

  /**
   *
   * @param {Message} message
   */
  static executeCommand = (message) => {
    const tokens = Tokenizer.tokenize(message);
    const command = this.cmds.get(tokens[0]);

    if (!command) {
      message.channel.send("That command doesn't exist");
      return;
    }

    try {
      this.handlers.get(command.type).execute(command, message, tokens);
    } catch (err) {
      console.log(err);
      message.channel.send("There was a problem executing that command");
    }
  };
}

module.exports = Commands;
