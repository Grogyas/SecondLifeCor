const { Client, Intents, ClientUser } = require('discord.js');
const chalk = require('chalk');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

require('dotenv').config();


client.once('ready', () => {
	console.log(chalk.blue('Logged in as'));
    console.log(chalk.blue("User: ") + chalk.red(client.user.tag) + chalk.blue(" ID: ") + chalk.red(client.user.id));
    console.log(chalk.blue("Login Time: ") + chalk.cyan(Date(Date.now()).toString()))
    console.log(chalk.blue("Version: ") + chalk.cyan(process.env.VERSION))
});

client.login(process.env.DISCORD_TOKEN);