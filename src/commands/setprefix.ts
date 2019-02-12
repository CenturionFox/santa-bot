import config from '../../config.json'
import Discord = require('discord.js')
import fs = require('fs')
import i18n = require('i18n')
import { ICommand, getPrefix } from "../commands"
import writeConfig from '../configuration';

export default class SetPrefixCommand implements ICommand {
  name: string = i18n.__('setprefix')
  syntax: string = i18n.__('setprefix <prefix> (requires admin permissions)')
  description: string = i18n.__('Sets the guild prefix to a custom value.  You must have the Administrator privilege to use this command.')
  run(_client: Discord.Client, message: Discord.Message, ...m_argv: string[]) {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply(i18n.__('you do not have permission to change the guild prefix!'))

    var prefix = m_argv[0]
    if (!prefix) return message.reply(i18n.__('you must specify a new prefix.'))

    config.prefix[message.guild.id] = prefix
    writeConfig(config)
    message.reply(i18n.__('the guild prefix has been changed to').concat(' "').concat(getPrefix(message.guild)).concat('"'))
  }
}