import * as config from '../../config.json'
import Discord = require('discord.js')
import { ICommand } from '../commands'
import { IEventHandler } from '../events';

export default class MessageHandler implements IEventHandler {
    constructor(public getCommands: Function, public client: Discord.Client) { }

    handle(...args: any[]) {
        var message: Discord.Message = args[0]
        if(message.content.indexOf(config.prefix) !== 0) return
        const m_argv = message.content.slice(config.prefix.length).trim().split(/ +/g)
        const c_name = m_argv.shift().toLowerCase()
        const command: ICommand = this.getCommands().get(c_name) as ICommand;
        
        if(!command) return console.warn(`Command ${command} could not be found.`)

        command.run(this.client, message, ...m_argv)
    }


}