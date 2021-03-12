const functions = require('../handlers/functions');

module.exports = (client, member) => {
    if (member.user.bot) return;
    
    let logs = member.guild.channels.cache.find(i => i.id === client.config.logsChannelID);
    let crewChat = member.guild.channels.cache.find(i => i.id === client.config.generalChannelID);

    member.roles.add(member.guild.roles.cache.find(i => i.name === 'Crewmate'));

    logs.send(`${member.displayName} (${member.user.username}) joined ${member.guild}`);
    crewChat.send(randomGreeting(member, functions.getRandomInt(10)), client);
}

const randomGreeting = (member, int, client) => {
    let infoChannel = member.guild.channels.cache.find(i => i.id === client.config.infoChannelID);
    let rolesChannel = member.guild.channels.cache.find(i => i.id === client.config.rolesChannelID);

    let welcome = `Welcome and please read ${infoChannel} and select your roles at ${rolesChannel}.`;

    let welcomeMessage = [
        `${member} just docked to the spaceship! ${welcome}`,
        `${member} is the newest crewmate! ${welcome}`,
        `${member} is here to help out with tasks! ${welcome}`,
        `${member} just spawned in the dropship! ${welcome}`,
        `${member}, try not to get ejected. ${welcome}`,
        `${member} is currently in decontamination. ${welcome}`,
        `${member}, hope you're not an imposter! ${welcome}`,
        `${member}, did you do your cardswipe? ${welcome}`,
        `${member}, is that a gun behind your back? ${welcome}`,
        `${member}, don't go in the vents. ${welcome}`
    ];

    return welcomeMessage[int];
}