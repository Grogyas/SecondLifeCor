const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const Enmap = require("enmap");
const config = require(`./config.json`);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES] });

require('dotenv').config();

const Distube = require('distube')
client.distube = new Distube.default(client)

client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});

client.on("messageCreate", (message) => {
    if(!message.guild || message.author.bot) return;
    client.settings.ensure(message.guild.id, {
        prefix: config.prefix,
        hellomsg: "Hello World!",
        roles: [],
    });
    //Get the settings
    let { prefix, hellomsg, roles } = client.settings.get(message.guild.id)
    //Get the arguments
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift()?.toLowerCase();
    //If there is a command, execute it
    if(cmd && cmd.length > 0 && message.content.startsWith(prefix)){
        if(cmd == "prefix"){
            message.reply(`Current prefix is \`${prefix}\`!\n**Go to the Dashboard to change it!**\n> ${dash.website.domain}`).catch(console.error);
        }
        if(cmd == "hello"){
            message.reply(hellomsg).catch(console.error);
        }
        if(cmd == "roles"){
            message.reply(roles.map(r=>`<@&${r}>`).join(", ")).catch(console.error);
        }
    }
})

client.on("ready", () => {
    require("./dashboard/index.js")(client);
})

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