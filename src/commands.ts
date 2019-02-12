import * as config from '../config.json'
import Discord = require('discord.js')
import i18n = require('i18n')
import Enmap from 'enmap'
import { sendGeneralHelpMessage } from './messages';

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

  /** The name of the command; in this case, "help", localized */
  name: string = i18n.__('help')
  /** The syntax of the command */
  syntax: string = i18n.__('help [command]')
  /** The command description */
  description: string = i18n.__('Provides a detailed overview of any command registered with the bot.')

  /**
   * Creates a new instance of the HelpCommand
   * @param getCommands The function used to get the enmap of all registered commands
   */
  constructor(public getCommands: Function) { }

  /** Executes the command */
  public run(client: Discord.Client, message: Discord.Message, ...m_argv: string[]): any {
    var commands: Enmap<string, ICommand> = this.getCommands()
    var commandName: string = m_argv[0]
    var prefix = getPrefix(message.guild)

    if (!commandName) {
      return sendGeneralHelpMessage(client, message)
    }

    var command: ICommand = commands.get(commandName)
    if (command) {
      var helpMessage: string = command.description.concat('\r\n')
        .concat(i18n.__('Usage')).concat(':```').concat(prefix).concat(command.syntax).concat('```');
      return message.channel.send(helpMessage)
    }

    if (m_argv[0] == 'all') {
      var helpMessage: string = i18n.__("here's a list of all of the commands I can handle").concat(':\r\n');
      commands.forEach((value, key) => {
        helpMessage = helpMessage.concat('\t•\t').concat(prefix).concat(key).concat(':  \t`').concat(prefix).concat(value.syntax).concat('`\r\n');
      });
      return message.reply(helpMessage);
    }
    message.reply(i18n.__("I don't know the command").concat(' "').concat(m_argv[0]).concat('"!'))
  }
}

export function getPrefix(guild: Discord.Guild):string {
  if(!guild) return config.prefix.default

  return config.prefix[guild.id] || config.prefix.default
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

