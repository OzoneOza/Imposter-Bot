if (Number(process.version.slice(1).split('.')[0]) < 12) throw new Error('Node 12.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');
const Client = require('./resources/js/Client/Client');
const config = require('./resources/data/config.json');
const Enmap = require('enmap');
const fs = require('fs');
const { google } = require('googleapis');

const client = new Client();
client.commands = new Discord.Collection();

client.config = config;

fs.readdir('./resources/js/events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./resources/js/events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir('./resources/js/commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let props = require(`./resources/js/commands/${file}`);
        let commandName = props.name;
        client.commands.set(commandName, props);
    });
});

client.login(process.env.BOT_TOKEN);

//GMAIL API STUFF
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const SCOPE = process.env.GMAIL_SCOPE;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, SCOPE);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

client.oAuth2Client = oAuth2Client;