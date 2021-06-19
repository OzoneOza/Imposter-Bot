module.exports = {
    name: 'roles',
    args: '[@member]',
    description: 'Displays your roles or the member mentioned',
    run(client, msg)  {
        let member;
        let roles = '';

        if (!msg.mentions.members.first()) {
            member = msg.member;
        } else {
            member = msg.mentions.members.first();
        }
        
        for (role of member.roles.cache.array()) {
            roles = `${roles + role.name}, `;
        }

        msg.channel.send(`${member.displayName}'s Roles: ${roles.replace(', @everyone, ', '')}`);
    },
    setRole(embed, reaction, user, client) {
        reaction.users.remove(user);

        let member = reaction.message.guild.member(user);
        let emojiName = reaction.emoji.name.replace('crew', '');
        let logs = reaction.message.guild.channels.cache.find(i => i.id === client.config.logsChannelID);
        let generalPings = reaction.message.guild.roles.cache.find(i => i.name === 'general_pings');
        let amongUsPings = reaction.message.guild.roles.cache.find(i => i.name === 'among_us_pings');
        let moviePings = reaction.message.guild.roles.cache.find(i => i.name === 'movie_pings');
        let role = {
            type: null,
            result: ''
        };

        let colorRoles = [
            reaction.message.guild.roles.cache.find(i => i.name === 'Yellow'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Banana'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Orange'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Coral'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Red'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Maroon'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Brown'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Tan'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Lime'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Cyan'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Green'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Blue'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Black'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Gray'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Purple'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Pink'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'Rose'), 
            reaction.message.guild.roles.cache.find(i => i.name === 'White')
        ]
        
        if (embed.title === '**Pick Your Color**') {
            role.type = colorRoles.filter(i => i.name.toLowerCase() === emojiName);
            role.result = `'s color has been updated to ${emojiName}`;
            member.roles.remove(colorRoles).then(member => {
                member.roles.add(role.type);
            });
        }
    
        if (embed.title === '**Get Game Invite Pings**') {
            if (emojiName === 'megaphone') {
                role.type = generalPings;
                role.result = 'receive general game invite pings';
            }
            if (emojiName === 'among_us') {
                role.type = amongUsPings;
                role.result = 'receive Among Us game invite pings';
            }
            if (emojiName === '🎬') {
                role.type = moviePings;
                role.result = 'receive Movie watching pings'
            }
            if (!role.type) return;
            if (!member.roles.cache.find(i => i === role.type)) {
                member.roles.add(role.type);
                role.result = ` will now ${role.result}`;
            } else {
                member.roles.remove(role.type);
                role.result = ` will no longer ${role.result}`;
            }
        }
        
        logs.send(`${member.displayName} (${user.username})${role.result}`);
        reaction.message.channel.send(`${member.displayName}${role.result}!`).then(msg => {
            msg.delete({timeout: 5000});
        });
    }
}