import * as config from '../../config.json'
import Discord = require('discord.js')
import dcParser, { ParsedMessage } from 'discord-command-parser'
import { ICommand } from '../commands'
import { IEventHandler } from '../events'

export default class MessageHandler implements IEventHandler {
    constructor(public getCommands: Function, public client: Discord.Client) { }

    handle(...args: any[]) {

        var message: Discord.Message = args[0]
        var parsedCommand = dcParser.parse(message, config.prefix);

        if(!parsedCommand.success) return

        const m_argv = parsedCommand.arguments
        const c_name = parsedCommand.command
        const command: ICommand = this.getCommands().get(c_name) as ICommand;

        if(!command) return console.warn(`${message.member.user.username}: Command \"${c_name}\" could not be found.`)

        command.run(this.client, message, ...m_argv)
    }


}