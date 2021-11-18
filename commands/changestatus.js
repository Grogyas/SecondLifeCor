const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
require('dotenv').config();


module.exports = {
	permission: `${process.env.CHANGE_STATUS}`,

	data: new SlashCommandBuilder()
		.setName("changestatus")
		.setDescription("Sets the bots status")
		.addStringOption(option =>
			option
			.setName("content")
			.setDescription('Status content')
			.setRequired(true)
		),

	execute(interaction, versioncheck) {
		const StatusChanged = new MessageEmbed().setColor('GREEN').setTitle('<:success:910595039770579015>  Status Changed').setDescription(interaction.options.getString("content"))

		interaction.reply({embeds: [StatusChanged]})
		interaction.client.user.setPresence({ activities: [{ name: interaction.options.getString("content") }], status: 'ONLINE'})
	}
}

