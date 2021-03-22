const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const functions = require('../handlers/functions');

module.exports = {
    name: 'play',
    args: '<search terms|youtube link>',
    description: 'Plays a song/video from youtube',
    async run(client, msg, args) {
        try {
            let queue = msg.client.queue;
            let serverQueue = msg.client.queue.get(msg.guild.id);

            let voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send('You need to be in a voice channel before you can play music!');
            let permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return msg.channel.send('This bot does not have valid permissions to join and/or speak in this voice channel!');

            let song = {
                title: null,
                url: null
            };

            if (functions.isURL(args[0])) {
                let rawArgs = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
                rawArgs.shift();
    
                try {
                    let video = await ytdl.getInfo(rawArgs[0]);

                    song.title = video.videoDetails.title;
                    song.url = video.videoDetails.video_url;
                } catch (error) {
                    console.log(error);
                    return msg.channel.send(error.message);
                }
            } else {
                let videoFinder = async (query) => {
                    let videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }
                
                let video = await videoFinder(args.join(' '));
                if (!video) return msg.channel.send('No results were found, try again.');

                song.title = video.title;
                song.url = video.url;
            }

            if (!serverQueue) {
                let queueContruct = {
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
                return msg.channel.send(`:headphones:  **${song.title}** has been added to the queue!\nNumber **${serverQueue.songs.indexOf(song)}** in the queue.`);
            }
        } catch (error) {
            console.log(error);
            msg.channel.send(`Error: ${error.message}`);
        }
    },
    async play(msg, song) {
        let queue = msg.client.queue;
        let guild = msg.guild;
        let serverQueue = queue.get(msg.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        let dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on('finish', () => {
              serverQueue.songs.shift();
              this.play(msg, serverQueue.songs[0]);
          })
          .on('error', error => {
              console.error(error);
              msg.channel.send(`Error: ${error.message}`);
              serverQueue.songs.shift();
              this.play(msg, serverQueue.songs[0]);
          });
        dispatcher.setVolumeLogarithmic(1);
        serverQueue.textChannel.send(`:notes:  Now playing: **${song.title}**`);
    }
}