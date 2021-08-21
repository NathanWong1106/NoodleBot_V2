require("dotenv").config();
const Discord = require("discord.js");
const CommandHandler = require("./util/CommandHandler");
const GuildState = require("./objects/GuildState");

class NoodleBot {
    /**
     * Client object of an instance of NoodleBot
     * @type Discord.Client
     * @static
     */
    static client = new Discord.Client(
        { intents: [
            Discord.Intents.FLAGS.GUILDS, 
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_MESSAGES
            ] 
        });

    /**
     * Map of all Guild IDs with the bot's respective state
     * @type Map<String, GuildState>
     * @static
     */
    static guildStates = new Map();

    /**
     * Contains all startup sequences of the bot
     */
    static start = async () => {
        this.client.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;
            CommandHandler.handleCommand(interaction);
        })
        await this.client.login(process.env.DISCORD_TOKEN);
        await CommandHandler.init(false);
        this.#initGuilds();
    }

    static #initGuilds = () => {
        this.client.guilds.cache.forEach(guild => {
            this.guildStates.set(guild.id, new GuildState(guild.id));
        })
    }
}

module.exports = NoodleBot;

(
    async () => {
        if(require.main === module){
            try {
                await NoodleBot.start();
                console.log("[STARTUP] Startup succeeded");
            } catch (error) {
                console.error("[STARTUP] Startup encountered a problem:");
                console.error(error);
            }
        }
    }
)()