import { Client } from 'discord.js'
import IEventHandler from '../api/iEventHandler'
import HelpCommand from './helpCommand';

/**
 * Represents a bus upon which to register events.
 */
export default class EventBus {

    /**
     * Initializes a new instance of EventBus
     * @param client The discord client instance upon which all event handlers should be registered
     */
    constructor(public client: Client, public getCommand: Function) { }

    /**
     * Registers an event handler with the event chain
     * @param eventHandler The event handler to register
     */
    public register(eventHandler: IEventHandler): void {
        this.client.on(eventHandler.name, eventHandler.handle.bind(eventHandler, this.getCommand, this.client))
    }
}