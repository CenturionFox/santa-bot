import i18n = require('i18n')
import dcParser from 'discord-command-parser'
import yparser from 'yargs-parser'
import { Client, Message } from 'discord.js'
import ICommand from '../api/iCommand'
import IEventHandler from '../api/iEventHandler'
import { getPrefix } from '../src/configuration'

/** Handles any message events, and parses commands */
export default class MessageHandler implements IEventHandler {
    /** The name of the event */
    name: string = "message"

    /**
     * Creates a new instance of the MessageHandler class
     * @param getCommands A function used to retrieve an enmap of all registered commands
     * @param client The discord client instance
     */
    constructor(public getCommands: Function, public client: Client) { }

    /**
     * Handles the message events.
     * @param message The message to handle
     * @param _args All other arguments
     */
    handle(message: Message) {
        var prefix = getPrefix(message.guild) as string

        var parsedCommand = dcParser.parse(message, prefix);

        if (!parsedCommand.success) return

        const m_argv = parsedCommand.arguments
        var c_name = parsedCommand.command
        var command: ICommand = this.getCommands().get(c_name) as ICommand

        var senderId: string

        // Gets the ID of the user and the ID of the chat for logging
        if (message.guild) {
            senderId = message.member.displayName.concat('@').concat(message.guild.id).concat(':')
        }
        else {
            senderId = message.author.username.concat('@').concat(this.client.user.id).concat(':')
        }

        if (!command && !(c_name.startsWith(prefix) && (command = this.getCommands().get(c_name.slice(prefix.length)) as ICommand))) {
            return console.warn(senderId, i18n.__("Command"), c_name, i18n.__("did not exist in the list of registered commands (prefix collision?)"))
        }

        var p_argv = yparser(m_argv, command.options)
        console.debug(senderId, i18n.__("Execute"), c_name, m_argv.join(" "))

        // Check perms and execute
        if (command.permCheck(message)) {
            command.run(this.client, message, p_argv)
        }
    }
}