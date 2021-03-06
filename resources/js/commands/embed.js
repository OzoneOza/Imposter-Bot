const Discord = require('discord.js');

module.exports = {
    admin: true,
    name: 'embed',
    args: '<name>',
    description: 'Adds a preset embed',
    run(client, msg, args)  {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return;

        if (args[0] === 'colors') {
            this.sendEmbed(msg, args[0]);
            msg.delete({timeout: 100});
        }

        if (args[0] === 'pings') {
            this.sendEmbed(msg, args[0]);
            msg.delete({timeout: 100});
        }
    },
    sendEmbed(msg, name, client) {
        let embed = new Discord.MessageEmbed().setColor(0xA00405);

        if (name === 'clear') {
            embed.setTitle('**Delete the Last 100 Messages?**')
            .setThumbnail('https://i.imgur.com/ov3jQTA.jpg')
            .setDescription(`To confirm the deletion of the last 100 messages in ${msg.channel.name} click ✅.\nTo cancel this command click 🚫`);
            
            msg.channel.send(embed).then(msg => {
                msg.react('✅');
                msg.react('🚫');
            });
            return;
        }

        if (name === 'colors') {
            embed.setTitle('**Pick Your Color**')
            .setThumbnail('https://i.imgur.com/kduHVq4.png')
            .setDescription('Choose a reaction below to select your color, crewmate!');

            msg.channel.send(embed).then(msg => {
                msg.react('784695324907274241'); //yellow
                msg.react('855628067845963797'); //banana
                msg.react('784695216375857162'); //orange
                msg.react('855628034211315742'); //coral
                msg.react('784695282276761600'); //red
                msg.react('855628127720308757'); //maroon
                msg.react('784695107206119435'); //brown
                msg.react('855612858590298112'); //tan
                msg.react('784695198193811487'); //lime
                msg.react('784695134251253780'); //cyan
                msg.react('784695171467182080'); //green
                msg.react('784695084755058699'); //blue
                msg.react('784695050524688424'); //black
                msg.react('855628109663436811'); //gray
                msg.react('784695261288857610'); //purple
                msg.react('784695236902387722'); //pink
                msg.react('855628095061884938'); //rose
                msg.react('784695304674476032'); //white
            });
            return;
        }

        if (name === 'games') {
            embed.setTitle('**Games**')
            .setThumbnail('https://i.imgur.com/ov3jQTA.jpg');
            let info = msg.guild.channels.cache.find(i => i.id === client.config.infoChannelID);
            info.messages.fetch('790514757483626506').then(infoMessage => {
                let gamesList = infoMessage.content.replace('Welcome and good luck, have fun, don’t die! 🙂', '').replace(': :', '').trim().split('- ');

                for (game of gamesList) {
                    if (gamesList.indexOf(game) !== 0) {
                        console.log(game);
                        if (game.includes(')*')) {
                            let gameFormat = game.split(')* ');
                            embed.addField(`${gameFormat[0]})*`, gameFormat[1]);
                        } else {
                            let gameFormat = game.split(') ');
                            embed.addField(`${gameFormat[0]})`, gameFormat[1]);
                        }
                    }
                }
            });
            msg.channel.send(embed);
        }


        if (name === 'help') {
            embed.setTitle('**List of Commands**')
            .setThumbnail('https://i.imgur.com/ov3jQTA.jpg');

            let commands = client.commands.array();
            for (cmd of commands) {
                embed.addField(`${cmd.admin ? '(ADMIN) ' : ''}${client.config.prefix + cmd.name} ${cmd.args}`, cmd.description);
            }
        
            msg.channel.send(embed);
            return;
        }

        if (name === 'pings') {
            embed.setTitle('**Get Special Roles**')
            .setThumbnail('https://i.imgur.com/0WUIRA0.png')
            .setDescription('React with <:megaphone:784695010913288192> to receive general game invite pings.\nReact with <:among_us:796184810279403530> to receive Among Us game invite pings.\nReact with :clapper: to receive Movie watching pings.\nReact with :underage: to gain access to NSFW channels.\nTo toggle off pings select the reaction again!');
            
            msg.channel.send(embed).then(msg => {
                msg.react('784695010913288192');
                msg.react('796184810279403530');
                msg.react('🎬');
                msg.react('🔞')
            }); 
            return;
        }

        if (name === 'queue') {
            let serverQueue = msg.client.queue.get(msg.guild.id);

            embed.setTitle('**Song Queue**')
            .setThumbnail('https://i.imgur.com/ov3jQTA.jpg');

            for (song of serverQueue.songs) {
                embed.addField('\u200B', `${serverQueue.songs.indexOf(song) === 0 ? 'Now Playing:' : `${serverQueue.songs.indexOf(song)})`} [${song.title}](${song.url})`);
            }

            msg.channel.send(embed);
            return;
        }

        if (name === 'rules') {
            embed.setTitle('**Rules**')
            .setThumbnail('https://i.imgur.com/ov3jQTA.jpg')
            .addFields(
                {name: ':one:  Be respectful, kind, and aware of the power of your words.', value: '\u200B'},
                {name: ':two:  Play the game with integrity, i.e do not cheat.', value: '\u200B'},
                {name: ':three:  Use the channels for their appropriate subject matter.', value: '\u200B'},
                {name: ':four:  Do not load the server with spam.', value: '\u200B'},
                {name: ':five:  Discrimination will not be tolerated.', value: '\u200B'}
            );

            msg.channel.send(embed);
            return;
        }

        if (name === 'steam') {
            let guild = client.guilds.cache.find(i => i.id === client.config.guildID);
            
            embed.setTitle(`**${guild} Steam Account**`)
            .setThumbnail('https://i.imgur.com/l5TVAwk.png')
            .setDescription(`${guild}'s free-to-use steam account to play games like Jackbox Party 6 (and more to come). For access, login with the details below. 
            If steam asks for a verification code, reply "code" in this DM.
            \nPlease use the account responsibly, we hope you enjoy!`)
            .addField('Account name', 'skiponsix')
            .addField('Password', 'Shooton7');

            msg.author.send(embed);
            return;
        }
    }
}