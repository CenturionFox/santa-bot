import { Client } from 'discord.js'

/**
 * Represents an event handler.
 */
export default interface IEventHandler {
    /** The name of the event */
    name: string
    /** The function to fire to handle the event 
     * @param getCommands A function that returns an enmap containing all registered commands
     * @param client The discord client instance
     */
    handle(getCommands: Function, client: Client, ...args:any[]): any;
}