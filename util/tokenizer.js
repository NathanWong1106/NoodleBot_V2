class Tokenizer {
  static tokenize = (message) => {
    return message.content.slice(1).split(/ +/);
  };

  /**
   *
   * @param {Array<string>} tokens
   */
  static concat = (tokens) => {
    let c = tokens.reduce((prev, curr) => `${prev} ${curr}`);
    return c;
  };
}

module.exports = Tokenizer;
