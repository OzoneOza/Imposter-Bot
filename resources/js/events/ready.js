module.exports = async client => {
    let guild = client.guilds.cache.find(i => i.id === client.config.guildID);
    let roleSelect = guild.channels.cache.find(i => i.id === client.config.rolesChannelID);
    let logs = guild.channels.cache.find(i => i.id === client.config.logsChannelID);
    
    console.log('Caching role-select messages');

    roleSelect.messages.fetch('855639384148541471');
    roleSelect.messages.fetch('855639483176452096');
    
    console.log('Imposter Bot is now ready to go!');
    logs.send('Imposter bot is back online');
}