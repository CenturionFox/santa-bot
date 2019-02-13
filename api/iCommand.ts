import { Client, Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';

/**
 * Provides basic structure for a bot command
 */
export default interface ICommand {

    /** The name of the command. The value of this variable will be used to import the command into the enmap. */
    name: string
    /** The syntax of the command. This is used when providing help information. */
    syntax: string
    /** The command description. This is used when providing help information. */
    description: string
    /** command line args parse options */
    options: Options

    /**
     * Executes the command.
     * @param client - The client instance
     * @param message - The message instance
     * @param m_argv - The parsed command arguments
     */
    run(client: Client, message: Message, args: Arguments): any;

    /**
     * Returns a boolean value based on the message which is used to
     * @param member
     */
    permCheck(message: Message): boolean;
}
