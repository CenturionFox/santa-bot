# santa-bot

Secret santa script for servers seeking suprise satisfaction

## Install

- Install the most recent LTS (long-term service) version of [Node.js](https://nodejs.org/en/)
- Open a command prompt of your choice and navigate to the directory where you cloned this repository
- Run the command `npm install` to install dependencies
- Copy and rename the `config.init.json` file to `config.json`
- Replace the value of `token` in `config.json` with your discord bot token

You can obtain your bot token from the [Discord Developer Portal](https://discordapp.com/developers/applications)

## Run

Just run the command `npm start`! If successful the bot should connect and send a welcome message to the server (first time only).

## Usage

The secret santa bot ships with the following commands:

- TODO: This

If you're feeling *spicy*, you can add your own custom commands as well!  Create them as TypScript (.ts) files in the `./src/commands/` folder, and implement the `ICommand` interface from `./src/commands.ts`.  The bot will automatically load them.  Note that side effects can occur, so ***DO NOT*** add *any* scripts that *you do not trust to run safely* to the `./src/commands` folder!  By default, only command files that match a name in the `regcmd.json` list will be loaded.  To override this functionality, you may set the `trustAllCmd` config value to `true`.  **This is not recommended**.  The same logic applies to events; you may handle any custom event you like, but the file must be present in the `regevt.json` list.