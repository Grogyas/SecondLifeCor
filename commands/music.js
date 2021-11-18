const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	permission: `${process.env.MUSIC}`,

	data: new SlashCommandBuilder()
		.setName("music")
		.setDescription("Music.")
		.addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Play a song')
				.addStringOption(option =>
					option
					.setName("song")
					.setDescription('Name of the song or URL')
					.setRequired(true)
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('volume')
				.setDescription('Adjust the volume')
				.addNumberOption(option =>
					option
					.setName("percent")
					.setDescription('10 = 10%')
					.setRequired(true)
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('queue')
				.setDescription('Show Queue')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('skip')
				.setDescription('Skip song')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('pause')
				.setDescription('Pause song')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('resume')
				.setDescription('Resume song')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('stop')
				.setDescription('Stop')
		),

	async execute(interaction, distube) {
		const { options, member, guild, channel } = interaction;
		const VoiceChannel = member.voice.channel;

		if(!VoiceChannel)
		return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`You must be in voice channnel`)]})

		if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
		return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`I am already playing music in a <#${guild.me.voice.channelId}>`)]})

		const queue = await interaction.client.distube.getQueue(VoiceChannel);

		try {
			switch(options.getSubcommand()) {
				case "play" : {
					interaction.client.distube.playVoiceChannel( VoiceChannel, options.getString("song"), { textChannel: channel, member: member });
					return interaction.reply({embeds: [new MessageEmbed().setColor('ORANGE').setTitle('<a:catJAM:910933029072023552>  Music').addField('<a:loading:910928777444458496>  Processing', `${interaction.options.getString("song")} by <@${interaction.member.user.id}>`)]});
				}
				case "volume" : {
					const Volume = options.getNumber("percent");
					if(Volume > 100 || Volume < 1 )
					return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setTitle('<a:catJAM:910933029072023552>  Music').setDescription('You have to specify number between 1 and 100')]}),

					interaction.client.distube.setVolume(VoiceChannel, Volume)
					return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`Volume has been set to ${Volume}%`)]})
				}
				case "skip" : 
					await queue.skip(VoiceChannel);
					return interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`Successully skipped`)]});
				case "stop" :
					await queue.stop(VoiceChannel);
					return interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`Successully stopped`)]});
				case "pause" :
					await queue.pause(VoiceChannel);
					return interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`Successully paused`)]});
				case "resume" :
					await queue.resume(VoiceChannel);
					return interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').setDescription(`Successully resumed`)]});
				case "queue" :
					if (!queue) {
						return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Queue").setDescription(`Empty`)]});
					} else {
						return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle("Queue").setDescription(`${queue.songs.map((song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`)]});
					}
			}

		} catch (err) {
			const errorEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle(`<:error:910591302402445343> ERROR`)
			.setDescription(`${err}`)
			return interaction.reply({embeds: [errorEmbed]}),
			console.log(err)
		}

	},
}