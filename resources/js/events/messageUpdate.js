const { User } = require("discord.js")

const URL = require('url').URL;

module.exports = (client, oldMsg, newMsg) => {
    if (newMsg.author.bot) return;

    if (newMsg.channel.id === client.config.linksChannelID) {
        let content = newMsg.content.split(/ +/g);
        const isURL = (s) => {
            try {
                new URL(s);
                return true;
            } catch (err) {
                return false;
            }
        }
        if (!(content.some(isURL) || newMsg.content.includes('<@'))) {
            newMsg.delete({timeout: 1000});
            newMsg.channel.send(`Edited messages without links or pings are not allowed!`).then(msg => {
                msg.delete({timeout: 5000});
            });
        }
        return;
    }
}