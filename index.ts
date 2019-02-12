import * as config from './config.json'
import Discord = require('discord.js')
import fs = require('fs')
import i18n = require('i18n')
import CommandRegistry, { ICommand, HelpCommand } from './src/commands'
import EventBus, { IEventHandler } from './src/events'

// Configure i18n to use locale directory
i18n.configure({
  locales: ['en'],
  directory: __dirname + "/locale"
});

var client = new Discord.Client()

var commandRegistry = new CommandRegistry()
var eventBus = new EventBus(client)

fs.readdir(`${__dirname}/src/commands/`, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!file.endsWith('.ts')) return console.warn(`Command file ${file} is not a typescript module`)

    try {
      const c_module = require(`${__dirname}/src/commands/${file}`)
      let command: ICommand = new c_module.default() as ICommand;
      if (!command) return console.error(`Unable to load default command class from ${file}`)
      const c_name = command.name
      commandRegistry.register(c_name, command)
      return console.log(`Successfully Registered Command ${c_name}`)
    } catch (ex) {
      return console.error(`Failed to register command in module ${file}: ${ex}`)
    }
  })
})

fs.readdir(`${__dirname}/src/events/`, (err, items) => {
  if (err) return console.error(err)
  items.forEach(file => {
    if (!file.endsWith('.ts')) return console.warn(`Event file ${file} is not a typescript module`)
    const e_name = file.split('.')[0]

    try {
      const e_module = require(`${__dirname}/src/events/${file}`)
      let event: IEventHandler = new e_module.default(() => commandRegistry, client) as IEventHandler
      eventBus.register(e_name, (message: Discord.Message) => event.handle(message))
    } catch (ex) {
      return console.error(`Failed to hook event handler ${e_name}: ${ex}`)
    }
  })
})

client.login(config.token)
  .catch(reason => {
    console.error(reason)
  })