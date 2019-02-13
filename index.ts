import * as config from './config.json'
import regcmd from './regcmd.json'
import regevt from './regevt.json'
import fs = require('fs')
import i18n = require('i18n')
import { Client } from 'discord.js'
import ICommand from './api/iCommand'
import IEventHandler from './api/iEventHandler'
import CommandRegistry from './src/commandRegistry'
import EventBus from './src/eventBus'

// Configure i18n to use locale directory
i18n.configure({
  locales: ['en'],
  directory: __dirname + "/locale"
});

var client = new Client()

var commandRegistry = new CommandRegistry()
var eventBus = new EventBus(client)

const cmdDir = `${__dirname}/commands/`
fs.readdir(cmdDir, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!(file.endsWith('.ts') || file.endsWith('.js'))) return console.warn(i18n.__('The file'),cmdDir.concat(file),i18n.__('is not a typescript module'))
    if(config.trustAllCmd !== true && regcmd.indexOf(file.slice(0, file.length - 3)) < 0) {
      return console.warn(i18n.__("Skipped registering command"),file,i18n.__("as it does not meet current trust requirements."))
    }

    try {
      const module = require(`${cmdDir}${file}`)
      const command: ICommand = new module.default() as ICommand;
      if (!command) return console.error(`Unable to load default command class from ${file}`)
      commandRegistry.register(command)
      return console.debug(i18n.__('Successfully registered command'),command.name)
    } catch (ex) {
      return console.error(i18n.__('Failed to register command in module'),file,':',ex)
    }
  })
})

const evtDir = `${__dirname}/events/`
fs.readdir(evtDir, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!(file.endsWith('.ts') || file.endsWith('.js'))) return console.warn(i18n.__('The file'),evtDir.concat(file),i18n.__('is not a typescript module'))
    if(config.trustAllCmd !== true && regevt.indexOf(file.slice(0, file.length - 3)) < 0) {
      return console.warn(i18n.__("Skipped registering event"),file,i18n.__("as it does not meet current trust requirements."))
    }

    try {
      const module = require(`${evtDir}${file}`)
      const event: IEventHandler = new module.default(() => commandRegistry, client) as IEventHandler
      eventBus.register(event)
      return console.debug(i18n.__('Successfully registered event handler'),event.name)
    } catch (ex) {
      return console.error(i18n.__('Failed to hook event handler'),file,':',ex)
    }
  })
})

client.login(config.token)
  .catch(reason => {
    console.error(reason)
  })