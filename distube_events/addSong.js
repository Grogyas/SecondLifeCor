const { MessageEmbed } = require('discord.js')

module.exports = (client, queue, song) => {

    const SongAdded = new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').addField("🆕  Song added to queue",`${song.name}`)

    queue.textChannel.send({embeds: [SongAdded]})
}