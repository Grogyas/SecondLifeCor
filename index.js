const { Client, Intents, Collection, Interaction } = require('discord.js');
const chalk = require('chalk');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const pjson = require('./package.json');
const request = require("request")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const cerror = chalk.bold.red;
const cwarning = chalk.keyword('orange');
const csuccess = chalk.bold.green;

require('dotenv').config();

client.once('ready', () => {
	console.log(chalk.blue('Logged in as'));
    console.log(chalk.blue("User: ") + chalk.red(client.user.tag) + chalk.blue(" ID: ") + chalk.red(client.user.id));
    console.log(chalk.blue("Login Time: ") + chalk.cyan(Date(Date.now()).toString()))

	if (process.env.TYPE === "DEV" || process.env.TYPE === "DEV2" || process.env.TYPE === "PUBLIC" ) {
	    console.log(chalk.blue("Type: ") + chalk.cyan(process.env.TYPE))
	} else {
		console.log(cerror("Type: Invalid (" + process.env.TYPE + ")"))
	}

	versioncheck()
	
	const CLIENT_ID = client.user.id;

	const rest = new REST({
		version: "9"
	}).setToken(process.env.DISCORD_TOKEN);

	(async () => {
		try {
			if (process.env.TYPE === "PUBLIC") {
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands
				});
			} else if (process.env.TYPE === "DEV" || process.env.TYPE === "DEV2") {
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.DEV_GUILD_ID), {
					body: commands
				});
			}
		} catch (err) {
			if (err) console.error(err)
		}
	})();

	if (process.env.TYPE === "DEV2") {
		console.log(chalk.cyan("⏬ Commands Registered ⏬"))
		console.log(commandFiles)
		console.log(chalk.cyan("🔼 Commands Registered 🔼"))
	}
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		if (err) console.error(err);

		await interaction.reply({content: "An error occurred", ephemeral: true})
	}
});

function versioncheck() {
	request({
	    url: "https://raw.githubusercontent.com/Grogyas/SecondLifeCord/main/package.json",
	    json: true
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
			if (pjson.version < body.version) {
				console.log(chalk.blue("Version: ") + cerror(pjson.version) + cwarning(" - New Version is out " + "(" + body.version + ")"))
			} else {
				console.log(chalk.blue("Version: ") + csuccess(pjson.version))
			}
	    }
	})
}

client.login(process.env.DISCORD_TOKEN);