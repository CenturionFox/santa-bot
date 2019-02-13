import config from '../config.json'
import fs = require('fs')
import i18n = require('i18n')
import { Guild } from 'discord.js'

/**
 * Writes the config object back to the config json to persist changes over sessions
 * @param config - The config object
*/
export function writeConfig(config: any) {
    fs.writeFile('config.json', JSON.stringify(config, null, 2), (err) => {
        if (err) return console.error(i18n.__('Config file write failed:'), err)
        console.log(i18n.__('Successfully updated the config file'))
    })
}

/**
 * Gets the command prefix for a specific guild.  If no prefix is specified, returns the default prefix
 * @param guild - The guild instance.  Can be null.
 */
export function getPrefix(guild: Guild): string {
    if (!guild) return config.prefix.default

    return config.prefix[guild.id] || config.prefix.default
}