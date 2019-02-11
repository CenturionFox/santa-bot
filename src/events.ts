import Discord = require('discord.js')

export interface IEventHandler {
    getCommands: Function
    client: Discord.Client

    handle(...args: any[]): any;
}

export default class EventBus {
    constructor(public client: Discord.Client) { }

    public register(name: string, listener: Function): void {
        this.client.on(name, listener)
    }
}