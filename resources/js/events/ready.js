module.exports = async client => {
    let guild = client.guilds.cache.find(i => i.name === 'Skip on Six');
    let roleSelect = guild.channels.cache.find(i => i.name === 'role-select');
    let logs = guild.channels.cache.find(i => i.name === 'logs');
    
    console.log('Caching role-select messages');

    roleSelect.messages.fetch('807882673754079232');
    roleSelect.messages.fetch('807882725758730240');
    
    console.log('Imposter Bot is now ready to go!');
    logs.send('Imposter bot is back online');
}