const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const pjson = require('../package.json');
const request = require("request")
const chalk = require('chalk');
const fs = require('fs')
require('dotenv').config();
const cerror = chalk.bold.red;
const cwarning = chalk.keyword('orange');
const csuccess = chalk.bold.green;
const command = require('../index.js')
const mongoose = require('mongoose')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

module.exports = {
    name: "ready",
    once: true,
    execute (client, commands) {
        console.log(chalk.blue('Logged in as'));
        console.log(chalk.blue("User: ") + chalk.red(client.user.tag) + chalk.blue(" ID: ") + chalk.red(client.user.id));
        console.log(chalk.blue("Login Time: ") + chalk.cyan(Date(Date.now()).toString()))

	    if (process.env.TYPE === "DEV" || process.env.TYPE === "DEV2" || process.env.TYPE === "PUBLIC" ) {
	        console.log(chalk.blue("Type: ") + chalk.cyan(process.env.TYPE))
	    } else {
	    	console.log(cerror("Type: Invalid (" + process.env.TYPE + ")"))
	    }

	    versioncheck()
        filescheck()
		database()

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
    }
}

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

function filescheck() {
    if (process.env.TYPE === "DEV2") {
        console.log(chalk.cyan("⏬ Commands Files Registered ⏬"))
        console.log(commandFiles)
        console.log(chalk.cyan("⏬ Event Files Registered ⏬"))
        console.log(eventFiles)
        console.log(chalk.cyan("🔼 Files Registered 🔼"))
    }
}

function database() {
	mongoose.connect(process.env.MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log(chalk.blue("Database: ") + chalk.green("Connected"))
	}).catch((err) => {
		console.log(chalk.red(err))
	})
}