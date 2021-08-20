const { Interaction } = require("discord.js");

/**
 * Represents any condition that must be met before a command is executed
 * 
 * (e.g. user must be connected to a VC in order to use audio commands)
 */
class Condition {
    /**
     * @param {String} name 
     * @param {function(Interaction):Boolean} execute 
     * @param {String} message 
     */
    constructor(name, execute, message) {
        this.name = name;
        this.execute = execute;
        this.message = message;
    }
}

module.exports = Condition;