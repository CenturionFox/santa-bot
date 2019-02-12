import Discord = require('discord.js')
import i18n = require('i18n')
import { IEventHandler } from "../events"

export default class ReadyHandler implements IEventHandler {
  constructor(public getCommands: Function, public client: Discord.Client) { }
  handle(...args: any[]) {
    // register error handlers
    this.client.on("error", (e: string) => console.error(e))
    this.client.on("warn", (w: string) => console.warn(w))
    this.client.on("info", (i: string) => console.info(i))

    console.log(`${this.client.user.username} ready for service!`)
  }
}