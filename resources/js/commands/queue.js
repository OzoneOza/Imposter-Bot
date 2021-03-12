const embed = require('./embed');

module.exports = {
    name: 'queue',
    args: '',
    description: 'Displays the song queue',
    run(client, msg)  {
        let serverQueue = msg.client.queue.get(msg.guild.id);
		if (!serverQueue) return msg.channel.send('There are no songs in the queue!');
        
        return embed.sendEmbed(msg, this.name);
    }
}