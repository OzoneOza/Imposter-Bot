const embed = require('./embed');

module.exports = {
    name: 'rules',
    args: '',
    description: 'Shows a list of the rules',
    run(client, msg) {
        embed.sendEmbed(msg, this.name);
    }
}