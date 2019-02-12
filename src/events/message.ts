import Discord = require('discord.js')
import dcParser from 'discord-command-parser'
import i18n = require('i18n')
import yparser = require('yargs-parser')
import { ICommand, getPrefix } from '../commands'
import { IEventHandler } from '../events'

export default class MessageHandler implements IEventHandler {
  name: string = "message"

  constructor(public getCommands: Function, public client: Discord.Client) { }

  handle(message: Discord.Message, ..._args: any[]) {

    var prefix = getPrefix(message.guild)

    var parsedCommand = dcParser.parse(message, prefix);

    if (!parsedCommand.success) return

    const m_argv = parsedCommand.arguments
    var c_name = parsedCommand.command
    var command: ICommand = this.getCommands().get(c_name) as ICommand

    const senderId = message.member.displayName.concat('@').concat(message.guild.id).concat(':')

    if(!command && !(c_name.startsWith(prefix) && (command = this.getCommands().get(c_name.slice(prefix.length)) as ICommand))) {
      return console.warn(senderId, i18n.__("Command"), c_name, i18n.__("did not exist in the list of registered commands (prefix collision?)")) 
    }

    console.debug(senderId, i18n.__("Execute"), c_name, m_argv)

    var p_argv = yparser(m_argv, command.options)
    command.run(this.client, message, p_argv)
  }


}