const { Interaction } = require('discord.js');
const Command = require('../objects/Command');
const CommandRegistryUtil = require('./CommandRegistryUtil');
const FileUtil = require('./FileUtil');

class CommandHandler {
    /**
     * Map of all command names and their respective command objects
     * @type Map<String, Command>
     */
    static commandMap = new Map();

    /**
     * Sets up the command handler
     * @param {Boolean} shouldUpdateGlobalRegistry should the Discord global command registry be updated with new commands?
     */
    static init = async (shouldUpdateGlobalRegistry=false) => {
        const files = FileUtil.getCommandFiles();
        if(shouldUpdateGlobalRegistry){
            await CommandRegistryUtil.updateGlobalCommandRegistry(files);
        }
        this.#populateCommandMap(files);
    }

    /**
     * Given a valid interaction command, invokes the corresponding command
     * @param {Interaction} interaction 
     */
    static handleCommand = async (interaction) => {
        let command = this.commandMap.get(interaction.commandName);
        
        for(let condition of command.conditions) {
            if(!condition.execute(interaction)){
                interaction.reply(condition.failureMsg);
                return;
            };
        }

        command.execute(interaction);
    }

    /**
     * Fills the command map with command names and their corresponding command object
     * @param {Array<String>} commandFiles routes to all commands
     */
    static #populateCommandMap = (commandFiles) => {
        for(let file of commandFiles) {
            let command = require(file);
            if(command instanceof Command){
                try {
                    this.commandMap.set(command.data.name, command);
                } catch (err) {
                    console.log(err);
                }
            }
            else {
                console.log(`[CommandHandler] File at "${file}" does not export an object of type Command. Consider moving this file out of "./commands" or exporting a Command object.`)
            }
        }
    }
}

module.exports = CommandHandler;
