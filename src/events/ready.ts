import config from '../../config.json'
import Discord = require('discord.js')
import i18n = require('i18n')
import { IEventHandler } from "../events"
import sendWelcomeMessage from "../messages"
import { runInThisContext } from 'vm';

export default class ReadyHandler implements IEventHandler {
  name: string = "ready"

  constructor(public getCommands: Function, public client: Discord.Client) { }
  handle(..._args: any[]) {
    // register error handlers
    this.client.on("error", (e: string) => console.error(e))
    this.client.on("warn", (w: string) => console.warn(w))
    this.client.on("info", (i: string) => console.info(i))

    this.client.user.setActivity(i18n.__('Gift Exchange'))
    console.log(i18n.__("Logged in as"), this.client.user.username, i18n.__("and ready for service!"))

    if (config.welcome.enabled) {
      this.client.guilds.forEach(guild => {
        sendWelcomeMessage(this.client, guild)
      })
    }
  }
}