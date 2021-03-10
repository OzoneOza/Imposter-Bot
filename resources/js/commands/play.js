const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const functions = require('../handlers/functions');

// module.exports = {
//     name: 'play',
//     args: '<search terms|youtube link>',
//     description: 'Plays a song/video from youtube',
//     async run(client, msg, args)  {
        
//         const voiceChannel = msg.member.voice.channel;
//         if (!voiceChannel) return msg.reply(`you need to be in a voice channel before you can play music!`);
        
//         const permissions = voiceChannel.permissionsFor(msg.client.user);
//         if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return msg.reply('this bot does not have valid permissions to join/speak in this voice channel!');

//         if (!args[0]) return msg.reply('you need to provide some search terms or a youtube link!');

//         const connection = await voiceChannel.join();

//         let song = {
//             title: null,
//             url: null,
//             textChannel: msg.channel,
//             connection: connection,
//             client: client
//         }

//         if (functions.isURL(args[0])) {
//             let rawArgs = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
//             rawArgs.shift();

//             const songInfo = await ytdl.getInfo(rawArgs[0])
//             .catch(error => console.log(error));

//             song.title = songInfo.videoDetails.title;
//             song.url = songInfo.videoDetails.video_url;
            
//         } else {
//             const videoFinder = async (query) => {
//                 const videoResult = await ytSearch(query);
//                 return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
//             }
            
//             const video = await videoFinder(args.join(' '));
    
//             if (video) {
//                 song.title = video.title;
//                 song.url = video.url;
//             } else {
//                 return msg.reply('no video results were found.');
//             }
//         }

//         if (!song.title) return msg.channel.send('There was an error playing your song.');

//         if (!client.songs.length) {
//             client.songs.push(song);
//             this.play(voiceChannel, song);
//             await msg.channel.send(`:notes:  Now playing: **${song.title}**  :notes:`);
//         } else {
//             client.songs.push(song);
//             msg.channel.send(`**${song.title}** has been queued.\nIt's currently number ${client.songs.indexOf(song)} in the queue!`);
//         }
//     },
//     async play(voiceChannel, song) {
//         if (!song) {
//             return voiceChannel.leave();
//         }
    
//         const stream = await ytdl(song.url, {filter: 'audioonly', highWaterMark: 1 << 25});
        
//         song.connection.play(stream, {seek: 0, volume: 1})
//         .on('finish', () => {
//             song.client.songs.shift();
//             this.play(voiceChannel, song.client.songs[0]);
//         }).on('error', error => console.log(error));
//     }
// }

module.exports = {
    name: 'play',
    args: '<search terms|youtube link>',
    description: 'Plays a song/video from youtube',
    async run(client, msg, args) {
        try {
            const queue = msg.client.queue;
            const serverQueue = msg.client.queue.get(msg.guild.id);

            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send('You need to be in a voice channel before you can play music!');
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return msg.channel.send('This bot does not have valid permissions to join and/or speak in this voice channel!');

            const song = {
                title: null,
                url: null
            };

            if (functions.isURL(args[0])) {
                let rawArgs = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
                rawArgs.shift();
    
                try {
                    const video = await ytdl.getInfo(rawArgs[0]);

                    song.title = video.videoDetails.title;
                    song.url = video.videoDetails.video_url;
                } catch (error) {
                    console.log(error);
                    return msg.channel.send(error.message);
                }
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }
                
                const video = await videoFinder(args.join(' '));
                if (!video) return msg.channel.send('No results were found, try again.');

                song.title = video.title;
                song.url = video.url;
            }

            if (!serverQueue) {
                const queueContruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    playing: true
                };

                queue.set(msg.guild.id, queueContruct);
                
                queueContruct.songs.push(song);

                try {
                    let connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    this.play(msg, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(`Error: ${error.message}`);
                }
            } else {
                serverQueue.songs.push(song);
                return msg.channel.send(`:headphones:  **${song.title}** has been added to the queue!\nNumber **${serverQueue.songs.indexOf(song)}** in the queue.  :headphones:`);
            }
        } catch (error) {
            console.log(error);
            msg.channel.send(`Error: ${error.message}`);
        }
    },
    async play(msg, song) {
        const queue = msg.client.queue;
        const guild = msg.guild;
        const serverQueue = queue.get(msg.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on('finish', () => {
              serverQueue.songs.shift();
              this.play(msg, serverQueue.songs[0]);
          })
          .on('error', error => {
              console.error(error);
              msg.channel.send(`Error: ${error.message}`);
          });
        dispatcher.setVolumeLogarithmic(1);
        serverQueue.textChannel.send(`:notes:  Now playing: **${song.title}**  :notes:`);
    }
}