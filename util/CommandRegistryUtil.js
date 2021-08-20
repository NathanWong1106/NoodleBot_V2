// Technically this could all be done as a fairly simple fetch() but these utilities make it simpler
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Command = require('../objects/Command');
const FileUtil = require('./FileUtil');

/**
 * Functions to register slash commands with the Discord API.
 */
class CommandRegistryUtil {
    /**
     * Registers or deletes global bot commands based on files contained in "./commands" using the Discord REST API
     * @param {Array<String>} commandFiles routes to all commands
     * @see https://discord.com/developers/docs/interactions/application-commands
     */
    static updateGlobalCommandRegistry = async (commandFiles) => {
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        try{
            let registeredCommands = await rest.get(
                Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID)
            );
            
            let currentCommands = [];

            for(let file of commandFiles) {
                let command = require(file);
                if(command instanceof Command){
                    currentCommands.push(command);
                }
                else {
                    console.log(`[CommandRegistryUtil] File at "${file}" does not export an object of type Command. Consider moving this file out of "./commands" or exporting a Command object.`)
                }
            }

            let toDelete = registeredCommands.filter(({name}) => !currentCommands.some((command) => command.data.name === name))

            for(let obj of toDelete) {
                await rest.delete(`${Routes.applicationsCommands(process.env.DISCORD_APPLICATION_ID)}/${obj.id}`);
            }

            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
                {
                    body: currentCommands.map(command => command.data.toJSON())
                }
            )
        } catch (err) {
            console.error(err);
            return;
        }
        
        console.log("[CommandRegistryUtil] Updated global commands");
    }
}

module.exports = CommandRegistryUtil;

// This file can also be run standalone to register/update/delete commands
// Runs only if this file is run as main
if(require.main === module){
    CommandRegistryUtil.updateGlobalCommandRegistry(FileUtil.getCommandFiles())
}
