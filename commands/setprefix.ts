import config from '../config.json'
import i18n = require('i18n')

import { Options, Arguments } from 'yargs-parser'
import { Client, Message } from 'discord.js'

import ICommand from '../api/iCommand'
import { writeConfig, getPrefix } from '../src/configuration'

/**
 * Allows the user to change the prefix for the guild that they are in.
 * The user must have administrative privileges and be in a text channel to alter their guild's prefix.
 */
export default class SetPrefixCommand implements ICommand {
    /** The command name */
    name: string = 'setprefix'
    /** The command syntax */
    syntax: string = 'setprefix [-p|--prefix] *prefix*'
    /** The localized command description */
    description: string = i18n.__('Sets the guild prefix to a custom value.  This command can only be used on a server, and you must have administrative privileges to use this command.')
    /** The parser options */
    options: Options = {
        alias: {
            prefix: ['-p']
        },
        string: ['prefix'],
        configuration: {
            "duplicate-arguments-array": false
        }
    }

    /**
     * Executes the setprefix command
     * @param _client Unused.  The discord client instance
     */
    run(_client: Client, message: Message, args: Arguments) {
        var prefix: string = (args['prefix'] || args._[0]) as string
        if (!prefix) return message.reply(i18n.__('you must specify a new prefix.'))

        config.prefix[message.guild.id] = prefix
        writeConfig(config)
        message.reply(i18n.__('the guild prefix has been changed to').concat(' "').concat(getPrefix(message.guild)).concat('"'))
    }

    /**
     * Check if the user has permission to change the prefix.
     * @param message The message to check and reply to
     */
    permCheck(message: Message): boolean {
        if (!message.guild) {
            message.reply(i18n.__("I'm sorry, but you can only set the prefix on a server that you have admin permissions on!"))
            return false
        }

        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.reply(i18n.__('you do not have permission to change the guild prefix!'))
            return false;
        }

        return true;
    }
}