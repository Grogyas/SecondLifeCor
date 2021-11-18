// Not Working
// Not done yet

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const { connection } = require('mongoose')
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
		.setDescription(`**Client**: <a:asuccess:910928528650948709> \`Online\` - \`${interaction.client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(interaction.client.readyTimestamp / 1000)}:R>\n**Database**: ${switchTo(connection.readyState)}`)
		interaction.reply({embeds: [StatusMessage]})
	},
}

function switchTo(val) {
	var status = " ";
	switch(val) {
		case 0 : status = '<a:aerror:910928653808980048>  \`Disconnected\`'
		break;
		case 1 : status = '<a:asuccess:910928528650948709> \`Connected\`'
		break;
		case 2 : status = '<a:awarning:910928608862814218> \`Connecting\`'
		break;
		case 3 : status = '<a:awarning:910928608862814218> \`Disconnecting\`'
		break;
	}
	return status;
}