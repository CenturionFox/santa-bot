import i18n = require('i18n')
import Enmap from 'enmap'
import { Options, Arguments } from 'yargs-parser'
import { Client, Message } from 'discord.js'
import ICommand from '../api/iCommand'
import { getPrefix } from './configuration'
import { sendGeneralHelpMessage } from './messages'

/**
 * A command which will provide help information about the bot, the available commands, and information on specific commands.
 */
export default class HelpCommand implements ICommand {
    /** The name of the command; in this case, "help", localized */
    name: string = 'help';
    /** The syntax of the command */
    syntax: string = 'help\r\nhelp {-a|--all}\r\nhelp [-c|--command] *command*';
    /** The command description */
    description: string = i18n.__('Provides a detailed overview of any command registered with the bot.');
    /** The command parser options */
    options: Options = {
        alias: {
            command: ['-c'],
            all: ['-a']
        },
        string: ['command'],
        configuration: {
            "duplicate-arguments-array": false
        }
    };

    /**
     * Creates a new instance of the HelpCommand
     * @param getCommands The function used to get the enmap of all registered commands
     */
    constructor(public getCommands: Function) { }

    /**
     * Executes the command.
     * @param client The discord client instance
     * @param message The message within which the command data resides
     * @param args The parsed yargs arguments of the command
     */
    run(client: Client, message: Message, args: Arguments): any {
        var commands = this.getCommands() as Enmap<string, ICommand>;
        var prefix = getPrefix(message.guild);

        if (args._.length == 0 && !args['all'] && !args['command']) {
            return sendGeneralHelpMessage(client, message);
        }

        if (args['all']) {
            var helpMessage: string = i18n.__("here's a list of all of the commands I can handle").concat(':\r\n');
            commands.forEach((value, key) => {
                helpMessage = helpMessage.concat('\t•\t`').concat(key).concat('`:\r\n');
                value.syntax.split('\r\n').forEach((option, i) => {
                    helpMessage = helpMessage.concat('\t\t•\t').concat(prefix).concat(option).concat('\r\n');
                });
            });
            helpMessage = helpMessage.concat(i18n.__("You can find out more by specifying one command specifically")).concat(':\r\n\t\t')
                .concat(prefix).concat('help [-c|--command] *command*');
            return message.reply(helpMessage);
        }

        var commandName = (args['command'] || args._[0]) as string;
        var command = commands.get(commandName) as ICommand;

        if (command) {
            var helpMessage: string = command.description.concat('\r\n')
                .concat(i18n.__('Usage')).concat(':\r\n');
            command.syntax.split('\r\n').forEach((option, i) => {
                if (i > 0)
                    helpMessage = helpMessage.concat('\r\n');
                helpMessage = helpMessage.concat('\t•\t').concat(prefix).concat(option);
            });
            return message.channel.send(helpMessage);
        }

        return message.reply(i18n.__("I don't know the command").concat(' "').concat(commandName).concat('"!'));
    }

    /**
     * Always returns true, as any user can ask for help
     * @param _message Unused. The command message to check permissions on
     */
    permCheck(_message: Message): boolean {
        return true;
    }
}
