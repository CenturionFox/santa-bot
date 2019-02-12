import * as config from './config.json'
import regcmd from './regcmd.json'
import regevt from './regevt.json'
import Discord = require('discord.js')
import fs = require('fs')
import i18n = require('i18n')
import CommandRegistry, { ICommand } from './src/commands'
import EventBus, { IEventHandler } from './src/events'

// Configure i18n to use locale directory
i18n.configure({
  locales: ['en'],
  directory: __dirname + "/locale"
});

var client = new Discord.Client()

var commandRegistry = new CommandRegistry()
var eventBus = new EventBus(client)

const cmdDir = `${__dirname}/src/commands/`
fs.readdir(cmdDir, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!file.endsWith('.ts')) return console.warn(i18n.__('The file'),cmdDir.concat(file),i18n.__('is not a typescript module'))
    if(config.trustAllCmd !== true && regcmd.indexOf(file.split('.')[0]) < 0) {
      return console.warn(i18n.__("Skipped registering command"),file,i18n.__("as it does not meet current trust requirements."))
    }

    try {
      const c_module = require(`${cmdDir}${file}`)
      let command: ICommand = new c_module.default() as ICommand;
      if (!command) return console.error(`Unable to load default command class from ${file}`)
      const c_name = command.name
      commandRegistry.register(c_name, command)
      return console.debug(i18n.__('Successfully registered command'),c_name)
    } catch (ex) {
      return console.error(i18n.__('Failed to register command in module'),file,':',ex)
    }
  })
})

const evtDir = `${__dirname}/src/events/`
fs.readdir(evtDir, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!file.endsWith('.ts')) return console.warn(i18n.__('The file'),evtDir.concat(file),i18n.__('is not a typescript module'))
    if(config.trustAllCmd !== true && regevt.indexOf(file.split('.')[0]) < 0) {
      return console.warn(i18n.__("Skipped registering event"),file,i18n.__("as it does not meet current trust requirements."))
    }

    const e_name = file.split('.')[0]

    try {
      const e_module = require(`${evtDir}${file}`)
      let event: IEventHandler = new e_module.default(() => commandRegistry, client) as IEventHandler
      eventBus.register(e_name, (message: Discord.Message) => event.handle(message))
      return console.debug(i18n.__('Successfully registered event handler'),e_name)
    } catch (ex) {
      return console.error(i18n.__('Failed to hook event handler'),e_name,':',ex)
    }
  })
})

client.login(config.token)
  .catch(reason => {
    console.error(reason)
  })