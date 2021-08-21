const { Interaction, VoiceState, GuildMember } = require("discord.js");
const NoodleBot = require("../bot");

/**
 * Represents any condition that must be met before a command is executed
 * 
 * (e.g. user must be connected to a VC in order to use audio commands)
 */
class Condition {
    /**
     * @param {String} name 
     * @param {String} failureMsg
     * @param {function(Interaction):Boolean} execute 
     */
    constructor(name, failureMsg, execute) {
        this.name = name;
        this.failureMsg = failureMsg;
        this.execute = execute;
    }

    //----------- List of available conditions -----------//

    /**
     * All conditions related to voice channels
     */
    static voice = {
        /**
         * The bot must be connected to a voice channel in the guild where the command was created
         */
        botIsConnected: new Condition("bot-connected", "NoodleBot is not connected to any voice channels in this server",
            (interaction) => {
                return NoodleBot.guildStates.get(interaction.guildId).audio.connection != null;
            }
        ),
        
        /**
         * The user must be in a voice chat in the same guild as the command
         */
        userInVC: new Condition("user-in-vc", "Connect to VC to use this command",
            (interaction) => {
                return interaction.member.voice.channel ? true : false;
            }
        ),

        /**
         * The user must be in the same voice chat that the bot is connected to
         */
        userInSameVC: new Condition("user-same-vc", "You must be in the same voice channel as NoodleBot to use this command",
            (interaction) => {
                return interaction.member.voice.channel.id === NoodleBot.guildStates.get(interaction.guildId).audio.connection.joinConfig.channelId;
            }
        )
    }

    /**
     * Contains logical operators for conditions
     */
    static operators = {
        /**
         * Returns the opposite of a condition (!)
         * @param {Condition} condition one of the preexisting conditions
         * @param {String} newMessage new failure message when condition is reversed, if null then original message is kept
         * @example Condition.functions.reverse(Condition.voice.botIsConnected);
         */
        not: (condition, newMessage=null) => {
            return new Condition(condition.name, newMessage ? newMessage : condition.failureMsg, 
                (interaction) => !condition.execute(interaction)
            );
        },

        /**
         * @param {Condition} condition1 first condition
         * @param {Condition} condition2 second condition
         * @param {String} newMessage new failure message if both conditions fail
         * @returns 
         */
        or: (condition1, condition2, newMessage) => {
            return new Condition(`${condition1.name} OR ${condition2.name}`, newMessage, 
                (interaction) => condition1.execute(interaction) || condition2.execute(interaction)
            );
        }

        //NOTE: AND is the just the array of conditions defined in each command so not necessarily needed here
    }
}

module.exports = Condition;