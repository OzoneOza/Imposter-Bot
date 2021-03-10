const functions = require('../handlers/functions');

module.exports = (client, member) => {
    if (member.user.bot) return;
    
    const logs = member.guild.channels.cache.find(i => i.name === 'logs');
    const crewChat = member.guild.channels.cache.find(i => i.name === 'crew-chat');

    member.roles.add(member.guild.roles.cache.find(i => i.name === 'Crewmate'));

    logs.send(`${member.displayName} (${member.user.username}) joined ${member.guild}`);
    crewChat.send(randomGreeting(member, functions.getRandomInt(10)));
}

const randomGreeting = (member, int) => {
    const infoChannel = member.guild.channels.cache.find(i => i.name === 'info');
    const rolesChannel = member.guild.channels.cache.find(i => i.name === 'role-select');

    const welcome = `Welcome and please read ${infoChannel} and select your roles at ${rolesChannel}.`;

    const welcomeMessage = [
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