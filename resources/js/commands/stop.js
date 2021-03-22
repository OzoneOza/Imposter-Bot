module.exports = {
    name: 'stop',
    args: '',
    description: 'Stops the song and clears the queue',
    run(client, msg)  {
        let serverQueue = msg.client.queue.get(msg.guild.id);

        let voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send(`You need to be in a voice channel before you can stop the music!`);
        
        if (serverQueue.songs) serverQueue.songs = [];
        if (!serverQueue.connection.dispatcher) {
            serverQueue.voiceChannel.leave();
        } else {
            serverQueue.connection.dispatcher.end();
        }

        msg.channel.send(':octagonal_sign:  Music has been stopped and the queue has been cleared!');
    }
}