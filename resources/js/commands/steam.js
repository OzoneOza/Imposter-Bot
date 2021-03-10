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
        const gmail = google.gmail({ version: 'v1', auth: client.oAuth2Client });

        const listRes = await gmail.users.messages.list({userId: 'me'})
        .catch(error => {console.log(`The API returned an error: ${error}`);});
    
        const emails = listRes.data.messages;
    
        if (emails.length == 0) {
            msg.author.send('No verification code found. Try resending the verification email, or wait a few minutes.');
        } else {
            for (email of emails) {
                const getRes = await gmail.users.messages.get({userId: 'me', id: email.id})
                .catch(error => {console.log(`The API returned an error: ${error}`);});
    
                const snippet = getRes.data.snippet;
    
                if (snippet.includes('Steam Guard code')) {
                    const guild = client.guilds.cache.find(i => i.name === 'Skip on Six');
                    const logs = guild.channels.cache.find(i => i.name === 'logs');
    
                    msg.author.send(`Verification code: ${snippet.slice(91, 96)}`);
                    logs.send(`${msg.author.username} is attempting to access the steam account`);
                    break;
                }
            }
        }
    }
}