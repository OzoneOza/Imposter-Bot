const embed = require('./embed');

module.exports = {
    name: 'games',
    args: '',
    description: 'Shows a list of games frequently played on the server',
    run(client, msg)  {
        embed.sendEmbed(msg, this.name, client);
    }
}