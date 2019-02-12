import * as config from '../config.json'
import Discord = require('discord.js')
import i18n = require('i18n')
import Enmap from 'enmap'

/**
 * Provides basic structure for a bot command
 */
export interface ICommand {

  /** The name of the command. The value of this variable will be used to import the command into the enmap. */
  name: string
  /** The syntax of the command. This is used when providing help information. */
  syntax: string
  /** The command description. This is used when providing help information. */
  description: string

  /**
   * Executes the command.
   * @param client - The client instance
   * @param message - The message instance
   * @param m_argv - The parsed command arguments
   */
  run(client: Discord.Client, message: Discord.Message, ...m_argv: string[]): any;
}

/**
 * A command which will provide help information about the bot, the available commands, and information on specific commands.
 */
export class HelpCommand implements ICommand {
  name: string = i18n.__('help')
  syntax: string = i18n.__('help [command]')
  description: string = i18n.__('Provides a detailed overview of any command registered with the bot.')

  /**
   * Creates a new instance of the HelpCommand
   * @param getCommands The function used to get the enmap of all registered commands
   */
  constructor(public getCommands: Function) { }

  public run(client: Discord.Client, message: Discord.Message, ...m_argv: string[]): any {
    console.log(m_argv)
    var commands: Enmap<string, ICommand> = this.getCommands()
    var commandName: string = m_argv[0]
    if (!commandName) {
      var help = i18n.__("Hi! I'm the secret santa bot!").concat('\r\n')
        .concat(i18n.__("To list all commands available, just send ")).concat('`').concat(config.prefix).concat(i18n.__('help')).concat(' ').concat(i18n.__('all')).concat('`\r\n')
        .concat("Thanks <3")
      return message.channel.send(help)
    }

    var command: ICommand = commands.get(commandName)
    if (command) {
      var help: string = i18n.__("Here's what I have for the command").concat(' "').concat(command.name).concat('":\r\n')
        .concat(i18n.__('Usage')).concat(':```').concat(command.syntax).concat('```')
        .concat(command.description);
      return message.channel.send(help)
    }

    if (m_argv[0] == 'all') {
      var help: string = i18n.__("Here's a list of all of the commands I can handle").concat(':\r\n');
      commands.forEach((value, key) => {
        help = help.concat('\t•\t').concat(config.prefix).concat(key).concat(': `').concat(value.syntax).concat('`\r\n');
      });
      return message.channel.send(help);
    }
    message.channel.send(i18n.__("I don't know the command").concat(' "').concat(m_argv[0]).concat('"!'))
  }
}

export default class CommandRegistry {
  commands: Enmap<string, ICommand> = new Enmap<string, ICommand>();

  constructor() {
    let helpCommand = new HelpCommand(() => this.commands)
    this.register(helpCommand.name, helpCommand)
  }

  public register(name: string, listener: ICommand): Enmap<string, ICommand> {
    if (this.commands.has(name)) throw `Command ${name} has already been registered`;
    return this.commands.set(name, listener)
  }

  public get(name: string): ICommand {
    return this.commands.get(name) as ICommand
  }
}

