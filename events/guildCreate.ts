import config from '../config.json'
import { Client, Guild } from 'discord.js'
import IEventHandler from '../api/iEventHandler'
import { sendWelcomeMessage } from '../src/messages'

/** Sends a welcome message and sets a configured nickname when the bot first joins a guild. */
export default class GuildCreateEventHandler implements IEventHandler {
    /** The event name */
    name: string = "guildCreate";

    /**
     * Creates a new instance of the GuildCreateEventHandler
     * @param getCommands A function to return an enmap of all bot commands
     * @param client The discord client instance
     */
    constructor(public getCommands: Function, public client: Client) { }

    /**
     * Handles the guild join message
     * @param guild The guild that the bot is joining.
     * @param _args Unused.  Any further arguments.
     */
    handle(guild: Guild) {
        sendWelcomeMessage(this.client, guild);

        if (config.nickname && config.nickname !== "") {
            guild.me.setNickname(config.nickname)
        }
    }

}
