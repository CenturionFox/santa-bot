import fs = require('fs')
import i18n = require('i18n')

export default function writeConfig(config: any) {
  fs.writeFile('config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) return console.error(i18n.__('Config file write failed:'), err)
    console.log(i18n.__('Successfully updated the config file'))
  })
}