module.exports = (client, member) => {
    if (member.user.bot) return;

    let logs = member.guild.channels.cache.find(i => i.name === 'logs');
    logs.send(`${member.displayName} (${member.user.username}) left ${member.guild}`);
    
    member.guild.channels.cache.find(i => i.name === 'crew-chat').send(`${member} got ejected.`);
}