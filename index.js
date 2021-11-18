const { Client, Intents, Collection } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES] });

require('dotenv').config();

const Distube = require('distube')
client.distube = new Distube.default(client)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands))
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands))
    }
}

for (const file of fs.readdirSync('./distube_events')) {
    if (file.endsWith('.js')) {
        let fileName = file.substring(0, file.length - 3)
        let fileContents = require(`./distube_events/${file}`)
        client.distube.on(fileName, fileContents.bind(null, client))
    }
}

client.login(process.env.DISCORD_TOKEN);