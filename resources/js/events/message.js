const steam = require('../commands/steam');
const functions = require('../handlers/functions');

module.exports = (client, msg) => {
    if (msg.author.bot) return;

    if (msg.guild === null) {
        if (msg.content === 'code') {
            steam.readEmail(client, msg);
            return;
        }
        if (msg.content === 'steam') {
            let cmd = client.commands.get(msg.content);

            cmd.run(client, msg, '');
            return;
        }
        
        msg.author.send(`Try replying with "code" to receive the verification code for steam.`);
        return;
    }
    
    if (msg.channel.name === 'links-and-pings') {
        let content = msg.content.split(/ +/g);

        if (!(content.some(functions.isURL) || msg.content.includes('<@'))) {
            msg.delete({timeout: 100});
            msg.channel.send(`Messages without links or pings are not allowed!`).then(msg => {
                msg.delete({timeout: 5000});
            });
        }
        return;
    }

    if (msg.channel.id === client.config.voiceTextChannelID) {
        if (!msg.member.voice.channel) {
            msg.delete({timeout: 100});
            msg.channel.send(`You aren't allowed to send messages in ${msg.channel} without being connected to a voice channel!`).then(msg => {
                msg.delete({timeout: 5000});
            });
            return;
        }
    }

    if (msg.content.indexOf(client.config.prefix) !== 0) return;
    let logs = msg.guild.channels.cache.find(i => i.name === 'logs');
    logs.send(`${msg.member.displayName} (${msg.author.username}) issued command: ${msg.content}`);

    let args = msg.content.toLowerCase().slice(client.config.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    let cmd = client.commands.get(command);

    if (!cmd) return;

    cmd.run(client, msg, args);
}