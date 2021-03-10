const embed = require('./embed');

module.exports = {
    name: 'help',
    args: '',
    description: 'Shows a list of commands',
    run(client, msg)  {
        embed.sendEmbed(msg, this.name, client);
    }
}