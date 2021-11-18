const { MessageEmbed } = require('discord.js')

module.exports = (client, queue, song) => {

    const NowPlaying = new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').addField("▶️  Now Playing",`${song.name}`)

    queue.textChannel.send({embeds: [NowPlaying]})
}