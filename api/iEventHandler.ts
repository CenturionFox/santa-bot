import { Client } from 'discord.js'

/**
 * Represents an event handler.
 */
export default interface IEventHandler {
    /** A function that returns an enmap containing all registered commands */
    getCommands: Function
    /** The discord client instance */
    client: Client
    /** The name of the event */
    name: string
    /** The function to fire to handle the event */
    handle: Function
}