module.exports = {
    name: 'skip',
    args: '',
    description: 'Skips to the next song in the queue',
    run(client, msg)  {
        let serverQueue = msg.client.queue.get(msg.guild.id);

        let voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send(`You need to be in a voice channel before you can skip the song!`);

		if (!serverQueue || !serverQueue.songs[1]) return msg.channel.send('There are no songs in the queue!');

		serverQueue.connection.dispatcher.end();
        
        msg.channel.send('🚫  Skipping to the next song in the queue!');
    }
}