require('dotenv').config();
const chalk = require('chalk')
const {MessageEmbed} = require('discord.js')

module.exports = {
    name: "interactionCreate",
    async execute (interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		
		const MissingPerms = new MessageEmbed().setColor('RED').setTitle('<:error:910591302402445343>  ERROR').setDescription(`Missing Permissions (<@&${command.permission}>)`)
		const UnknownError = new MessageEmbed().setColor('RED').setTitle('<:error:910591302402445343>  ERROR').setDescription(`Unknown Error, Contact Developers`)

		if (!command) return;

		if (command.permission) {
			if (interaction.member.roles.cache.some(role => role.id === `${command.permission}`)) {
				try {
					await command.execute(interaction);
					console.log(chalk.yellowBright("Command Executed by ") + chalk.cyan(interaction.member.user.tag) + chalk.yellowBright(" (") + chalk.cyan(interaction.member.id) + chalk.yellowBright(") | ") + chalk.blue(interaction.commandName))
				} catch (err) {
					if (err) console.error(err);
					await interaction.reply({embeds: [UnknownError]})
				}
			} else {
				return interaction.reply({embeds: [MissingPerms]}),
				console.log(chalk.yellowBright("User ") + chalk.cyan(interaction.member.user.tag) + chalk.yellowBright(" (") + chalk.cyan(interaction.member.id) + chalk.yellowBright(") tried to execute command without permissions | ") + chalk.blue(interaction.commandName))
			}
		} else {
			try {
				await command.execute(interaction);
				console.log(chalk.yellowBright("Command Executed by ") + chalk.cyan(interaction.member.user.tag) + chalk.yellowBright(" (") + chalk.cyan(interaction.member.id) + chalk.yellowBright(") | ") + chalk.blue(interaction.commandName))
			} catch (err) {
				if (err) console.error(err);
				await interaction.reply({embeds: [UnknownError]})
			}
		}
    }
}

