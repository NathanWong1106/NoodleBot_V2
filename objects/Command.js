const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction } = require("discord.js");

/**
 * Contains all fields needed to register and execute a command
 */
class Command {
    /**
     * @param {String} name name of the command
     * @param {String} description description of the command
     * @param {SlashCommandBuilder} data SlashCommandBuilder to register slash command 
     * @param {function(Interaction)} execute the function of the command
     * @param {Array<Condition>} conditions functions to be executed before execute(); called in ascending order of index
     */
    constructor(name, description, data, execute, conditions=[]) {
        this.data = data;
        this.execute = execute;
        this.conditions = conditions;

        this.data.setName(name).setDescription(description);
    }
}

module.exports = Command;