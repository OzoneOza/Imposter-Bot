module.exports = (client, member) => {
    if (member.user.bot) return;

    let logs = member.guild.channels.cache.find(i => i.id === client.config.logsChannelID);
    logs.send(`${member.displayName} (${member.user.username}) left ${member.guild}`);
    
    member.guild.channels.cache.find(i => i.id === client.config.generalChannelID).send(`${member.user.username} got ejected.`);
}//a