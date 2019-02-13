import config from '../config.json'
import i18n = require('i18n')
import { Client } from 'discord.js'
import IEventHandler from '../api/iEventHandler'
import { sendWelcomeMessage } from '../src/messages'

/** Handles the ready event from the discord client */
export default class ReadyHandler implements IEventHandler {
    /** The name of the event */
    name: string = "ready"

    /**
     * Handles the ready event
     * @param _getCommands Unused. A function to retrieve an enmap of all registed commands
     * @param client The discord client instance
     * @param _args Unused.  All other arguments.
     */
    handle(_getCommands: Function, client: Client, ..._args: any[]) {
        // register error handlers
        client.on("error", (e: string) => console.error(e))
        client.on("warn", (w: string) => console.warn(w))
        client.on("info", (i: string) => console.info(i))

        client.user.setActivity(i18n.__('Gift Exchange'))
        console.log(i18n.__("Logged in as"), client.user.username, i18n.__("and ready for service!"))

        if (config.welcome.enabled) {
            client.guilds.forEach(guild => {
                sendWelcomeMessage(client, guild)
            })
        }
    }
}