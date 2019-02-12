import config from '../../config.json'
import Discord = require('discord.js');
import { IEventHandler } from "../events";
import sendWelcomeMessage from '../messages';

export default class GuildCreateEventHandler implements IEventHandler {
  name: string = "guildCreate";
  constructor(public getCommands: Function, public client: Discord.Client) { }
  handle(guild: Discord.Guild, ..._args: any[]) {
    sendWelcomeMessage(this.client, guild);

    if (config.nickname && config.nickname !== "") {
      guild.me.setNickname(config.nickname)
    }
  }
}
