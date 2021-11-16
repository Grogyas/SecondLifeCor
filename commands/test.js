const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cockerino")
		.setDescription("nice cock"),
	async execute(interaction) {
		interaction.reply({content: "Huge cooooooooooooock", ephemeral: true});
	}
}