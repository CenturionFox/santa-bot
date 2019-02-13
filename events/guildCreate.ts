import config from '../config.json'
import { Client, Guild } from 'discord.js'
import IEventHandler from '../api/iEventHandler'
import { sendWelcomeMessage } from '../src/messages'

/** Sends a welcome message and sets a configured nickname when the bot first joins a guild. */
export default class GuildCreateEventHandler implements IEventHandler {
    /** The event name */
    name: string = "guildCreate";

    /**
     * Handles the guild join message
     * @param _getCommands Unused. A function that returns an enmap containing all registered commands
     * @param client The discord client
     * @param guild The guild that the bot is joining.
     * @param _args Unused.  Any further arguments.
     */
    handle(_getCommands: Function, client: Client, guild: Guild, ..._args: any[]) {
        sendWelcomeMessage(client, guild);

        if (config.nickname && config.nickname !== "") {
            guild.me.setNickname(config.nickname)
        }
    }

}
