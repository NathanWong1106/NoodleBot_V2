require("dotenv").config();
const Discord = require("discord.js");
const CommandHandler = require("./util/CommandHandler");

class NoodleBot {
    /**
     * Client object of an instance of NoodleBot
     * @type Discord.Client
     */
    static client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

    /**
     * Map of all Guild IDs with the bot's respective state
     * @type Map<String, GuildState>
     */
    static guildStates = new Map();

    /**
     * Contains all startup sequences of the bot
     */
    static start = () => {
        this.client.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;
            CommandHandler.handleCommand(interaction);
        })
        this.client.login(process.env.DISCORD_TOKEN);

        CommandHandler.registerSlashCommands(process.env.DISCORD_CLIENT_ID);
    }
}

(
    () => {
        try {
            NoodleBot.start();
            console.log("[STARTUP] Startup succeeded");
        } catch (error) {
            console.error("[STARTUP] Startup encountered a problem:");
            console.error(error);
        }
    }
)()