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
     * @param {String} route route to access
     * @see https://discord.com/developers/docs/interactions/application-commands
     */
    static #updateRegistry = async(commandFiles, route) => {
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
                await rest.delete(`${route}/${obj.id}`);
            }

            await rest.put(
                route,
                {
                    body: currentCommands.map(command => command.data.toJSON())
                }
            )
        } catch (err) {
            console.error(err);
            return;
        }
    }

    static #deleteRegistry = async(route) => {
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        try{
            let registeredCommands = await rest.get(
                route
            );

            for(let obj of registeredCommands) {
                await rest.delete(`${route}/${obj.id}`);
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }

    static updateGlobalCommandRegistry = async(commandFiles) => {
        await this.#updateRegistry(commandFiles, Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID));
        console.log("[CommandRegistryUtil] Updated global commands");
    }

    static updateGuildCommandRegistry = async(commandFiles, guildID) => {
        await this.#updateRegistry(commandFiles, Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, guildID));
        console.log("[CommandRegistryUtil] Updated guild commands");
    }

    static clearGlobalCommands = async() => {
        await this.#deleteRegistry(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID));
        console.log("[CommandRegistryUtil] Deleted global commands");
    }

    static clearGuildCommands = async(guildID) => {
        await this.#deleteRegistry(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, guildID));
        console.log("[CommandRegistryUtil] Deleted guild commands");
    }
}

module.exports = CommandRegistryUtil;

// This file can also be run standalone to register/update/delete commands
// Runs only if this file is run as main
if(require.main === module){
    require("dotenv").config();
    CommandRegistryUtil.updateGuildCommandRegistry(FileUtil.getCommandFiles(), process.env.TEST_GUILD_ID);
}
