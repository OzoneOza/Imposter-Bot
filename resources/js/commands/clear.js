const embed = require('./embed');

module.exports = {
    admin: true,
    name: 'clear',
    args: '',
    description: 'Bulk deletes last 100 messages in a channel',
    run(client, msg)  {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return;

        embed.sendEmbed(msg, this.name);
        msg.delete({timeout: 100});
    },
    clear(reaction) {
        const channel = reaction.message.channel;

        if (reaction.emoji.name === '✅') {
            channel.messages.fetch({limit: 100}).then(msgs => {
                msgs.forEach(msg => msg.delete());
            });
        }
        
        if (reaction.emoji.name === '🚫') {
            reaction.message.delete();
        }
    }
}