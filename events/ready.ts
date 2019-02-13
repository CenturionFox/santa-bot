import config from '../config.json'
import i18n = require('i18n')
import {Client} from 'discord.js'
import IEventHandler from '../api/iEventHandler'
import { sendWelcomeMessage } from '../src/messages'

/** Handles the ready event from the discord client */
export default class ReadyHandler implements IEventHandler {
    /** The name of the event */
  name: string = "ready"

  /**
   * Creates a new instance of the ReadyHandler class
   * @param getCommands A function to retrieve an enmap of all registed commands
   * @param client The discord client instance
   */
  constructor(public getCommands: Function, public client: Client) { }

  /**
   * Handles the ready event
   */
  handle() {
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