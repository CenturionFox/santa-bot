import Discord = require('discord.js')
import i18n = require('i18n')
import Enmap from 'enmap'
import { ArgumentParser } from 'argparse'

export interface ICommand {
    name: string

    run(client: Discord.Client, message: Discord.Message, ...m_argv: string[]): any;
}

export class HelpCommand implements ICommand {
    name: string = 'help'

    constructor(public getCommands: Function) {
        
    }

    public run(client: Discord.Client, message: Discord.Message, ...m_argv: string[]): any {
        console.log(m_argv)
    }

}

export default class CommandRegistry {
    commands: Enmap<string, ICommand> = new Enmap<string, ICommand>();

    constructor() {
        let helpCommand = new HelpCommand(() => this.commands)
        this.register('help', helpCommand)
    }

    public register(name: string, listener: ICommand): Enmap<string, ICommand> {
        if (this.commands.has(name)) throw `Command ${name} has already been registered`;
        return this.commands.set(name, listener)
    }

    public get(name: string): ICommand {
        return this.commands.get(name) as ICommand
    }
}

