class GenericCommandHandler {
  static name = require("./commandTypes.json").GENERIC;
  static execute = async (command, message, tokens) => {
    command.execute(message, tokens);
  };
}

module.exports = GenericCommandHandler;
