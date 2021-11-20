// Not Working
// Not done yet

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
require('dotenv').config();
require('../events/ready')

module.exports = {
	permission: `${process.env.CHANGE_STATUS}`,
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Shows bots Status&Ping"),

	async execute(interaction, client) {

		const StatusMessage = new MessageEmbed()
		.setColor("GREEN")
		.setTitle('🤖  Status')
		.setDescription(`**Client**: <a:asuccess:910928528650948709> \`Online\` - \`${interaction.client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(interaction.client.readyTimestamp / 1000)}:R>`)
		interaction.reply({embeds: [StatusMessage]})
	},
}