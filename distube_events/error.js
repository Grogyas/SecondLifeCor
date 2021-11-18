const { MessageEmbed } = require('discord.js')

module.exports = (client, queue, song) => {

    //const SongAdded = new MessageEmbed().setColor('GREEN').setTitle('<a:catJAM:910933029072023552>  Music').addField("🆕  Song added to queue",`${song.name}`)

    distube.on("error", (message, err) => message.channel.send(
        "An error encountered: " + err
    ));

    //queue.textChannel.send({embeds: [SongAdded]})
}

