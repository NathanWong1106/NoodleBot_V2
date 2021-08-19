const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const Command = require('../objects/Command');
const commandPath = path.join(path.dirname(require.main.filename),"commands");

class CommandHandler {
    /**
     * Map of all command names and their respective command objects
     * @type Map<String, Command>
     */
    static commandMap = new Map();

    static registerSlashCommands = async (clientID) => {
        // from https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands
        let files = this.#getCommandFiles();
        let commands = [];
        
        for(let file of files) {
            let command = require(file);

            if(command instanceof Command){
                try {
                    commands.push(command.data.toJSON());
                    this.commandMap.set(command.data.name, command);
                } catch (err) {
                    console.log(err);
                }
            }
            else {
                console.log(`[CommandHandler] File at "${file}" does not export an object of type Command. Consider moving this file out of "./commands" or exporting a Command object.`)
            }
        }
        
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

        try{
            await rest.put(
                Routes.applicationCommands(clientID),
                { body: commands }
            )
        } catch (err) {
            console.error(err);
        }

    }

    /**
     * Given a valid interaction command, invokes the corresponding command
     * @param {Interaction} interaction 
     */
    static handleCommand = async (interaction) => {
        let command = this.commandMap.get(interaction.commandName);
        
        for(let condition of command.conditions) {
            if(!condition(interaction)) return;
        }

        command.execute(interaction);
    }

    /**
     * Returns all js files (including nested files) in a directory
     * @param {String} dir directory to search through
     */
    static #getCommandFiles(dir=commandPath) {
        let files = [];
        for(const i of fs.readdirSync(dir)) {
            const iPath = path.join(dir, i)
            const isDir = fs.lstatSync(iPath).isDirectory()

            if(i.endsWith(".js") && !isDir) {
                files.push(iPath);
            } 
            else if (isDir) {
                files = files.concat(this.#getCommandFiles(iPath));
            }
        }
        return files;
    }
}

module.exports = CommandHandler;
