import config from '../../config.json'
import Discord = require('discord.js')
import i18n = require('i18n')
import yparser = require('yargs-parser')
import { ICommand, getPrefix } from "../commands"
import writeConfig from '../configuration';

export default class SetPrefixCommand implements ICommand {
  name: string = 'setprefix'
  syntax: string = 'setprefix [-p|--prefix] *prefix*'
  description: string = i18n.__('Sets the guild prefix to a custom value.  This command can only be used on a server, and you must have administrative privileges to use this command.')
  options: yparser.Options = {
    alias: {
      prefix: ['-p']
    },
    string: ['prefix'],
    configuration: {
      "duplicate-arguments-array": false
    }
  }

  run(_client: Discord.Client, message: Discord.Message, args: yparser.Arguments) {

    if(!message.guild) return message.reply(i18n.__("I'm sorry, but you can only set the prefix on a server that you have admin permissions on!"))

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply(i18n.__('you do not have permission to change the guild prefix!'))

    var prefix: string = (args['prefix'] || args._[0]) as string
    if (!prefix) return message.reply(i18n.__('you must specify a new prefix.'))

    config.prefix[message.guild.id] = prefix
    writeConfig(config)
    message.reply(i18n.__('the guild prefix has been changed to').concat(' "').concat(getPrefix(message.guild)).concat('"'))
  }
}