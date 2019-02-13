import i18n = require('i18n')
import Enmap from 'enmap'
import ICommand from '../api/iCommand'
import HelpCommand from './helpCommand'

/**
 * Represents a registry for bot commands.
 */
export default class CommandRegistry {

    /** The command map */
    commands: Enmap<string, ICommand> = new Enmap<string, ICommand>();

    /**
     * Instantiates a new instance of the CommandRegistry and initializes the 'help' command.
     */
    constructor() {
        let helpCommand = new HelpCommand(() => this.commands)
        this.register(helpCommand)
    }

    /**
     * Registers the passed command object in the command map
     * @param command The command to register
     */
    public register(command: ICommand): Enmap<string, ICommand> {
        if (this.commands.has(command.name)) throw i18n.__('Command').concat(` ${command.name} `).concat(i18n.__('has already been registered'));
        return this.commands.set(command.name.toLowerCase(), command)
    }

    /**
     * Gets a command by name from the command map
     * @param name The name of the desired command
     */
    public get(name: string): ICommand {
        return this.commands.get(name.toLowerCase()) as ICommand
    }
}

