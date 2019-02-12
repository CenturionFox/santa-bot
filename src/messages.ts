import config from '../config.json'
import i18n = require('i18n')
import Discord = require('discord.js')
import { getPrefix } from './commands'
import writeConfig from './configuration'

export default function sendWelcomeMessage(client: Discord.Client, guild: Discord.Guild) {
  if (config.welcome.enabled === true) {
    if (config.welcome.guilds[guild.id] !== true) {
      guild.channels.forEach(channel => {
        if (channel.type === "text") {
          var textChannel = channel as Discord.TextChannel;
          var me = guild.members.get(client.user.id)
          if (textChannel.memberPermissions(me).has("SEND_MESSAGES")) {
            var message = i18n.__('Hello everyone!').concat(' ').concat(me.displayName).concat(' ').concat(i18n.__(", the Secret Santa bot here.")).concat('\r\n')
              .concat(i18n.__("I'm here to make sure your next gift exchange goes as smooth as possible.")).concat('\r\n')
              .concat(i18n.__("Feel free to ask for")).concat(' `').concat(getPrefix(guild)).concat(i18n.__('help')).concat('` ').concat(i18n.__("if you're interested in learning more!")).concat('\r\n')
              .concat(i18n.__("Happy gifting!")).concat(' :gift_heart:')
            textChannel.send(message)
          }
        }
      })
      config.welcome.guilds[guild.id] = true
    }

    writeConfig(config)
  }
}

export function sendGeneralHelpMessage(client: Discord.Client, message: Discord.Message) {
  var helpMessage = i18n.__("hi! I'm").concat(' ').concat(message.guild.members.get(client.user.id).displayName).concat(', ').concat(i18n.__("the secret santa bot!")).concat('\r\n')
        .concat(i18n.__("To list all the commands that I can understand, just send")).concat(' `').concat(getPrefix(message.guild)).concat(i18n.__('help')).concat(' ').concat(i18n.__('all')).concat('` ').concat(i18n.__("to any channel I can read.")).concat('\r\n')
        .concat(i18n.__("You can also check out my documentation on")).concat(' https://www.github.com/centurionfox/santa-bot\r\n')
        .concat(i18n.__("Thanks!")).concat(' :sparkling_heart:')
      return message.reply(helpMessage)
}