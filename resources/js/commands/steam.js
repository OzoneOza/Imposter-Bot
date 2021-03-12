const { google } = require('googleapis');
const embed = require('./embed');

module.exports = {
    name: 'steam',
    args: '[code]',
    description: 'Sends a direct message to the user containing the steam account details',
    run(client, msg, args)  {
        if (!args[0]) {
            embed.sendEmbed(msg, this.name, client);
            return;
        }
    
        if (args[0] === 'code') {
            this.readEmail(client, msg);
            return;
        }
    },
    async readEmail(client, msg) {
        let gmail = google.gmail({ version: 'v1', auth: client.oAuth2Client });

        let listRes = await gmail.users.messages.list({userId: 'me'})
        .catch(error => {console.log(`The API returned an error: ${error}`);});
    
        let emails = listRes.data.messages;
    
        if (emails.length == 0) {
            msg.author.send('No verification code found. Try resending the verification email, or wait a few minutes.');
        } else {
            for (email of emails) {
                let getRes = await gmail.users.messages.get({userId: 'me', id: email.id})
                .catch(error => {console.log(`The API returned an error: ${error}`);});
    
                let snippet = getRes.data.snippet;
    
                if (snippet.includes('Steam Guard code')) {
                    let guild = client.guilds.cache.find(i => i.id === client.config.guildID);
                    let logs = guild.channels.cache.find(i => i.id === client.config.logsChannelID);
    
                    msg.author.send(`Verification code: ${snippet.slice(91, 96)}`);
                    logs.send(`${msg.author.username} is attempting to access the steam account`);
                    break;
                }
            }
        }
    }
}