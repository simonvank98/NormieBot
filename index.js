const Discord = require ('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const queue = new Map();


client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}henlo`)) {
		execute(message, serverQueue);
		return;
	} else if(message.content.startsWith(`${prefix}santagreetings`)) {
		return message.channel.send('Nee Guido, er komt geen santa greetings.');
	}
});

async function execute(message, serverQueue) {
	random = Math.floor(Math.random() * 7) + 1;

	switch (random) {
		case 1:
			var args = 'https://www.youtube.com/watch?v=CAozvVZk6CE';
			break;
		case 2:
			var args = 'https://www.youtube.com/watch?v=Q1BZlwOVFWo';
			break;
		case 3:
			var args = 'https://www.youtube.com/watch?v=p70TAlk4sqU';
			break;
		case 4:
			var args = 'https://www.youtube.com/watch?v=aG9APSWtLOE';
			break;
		case 5:
			var args = 'https://www.youtube.com/watch?v=G2qvrz-h2uY';
			break;
		case 6:
			var args = 'https://www.youtube.com/watch?v=OUGvXDNqDMU';
			break;
		case 7:
			var args = 'https://www.youtube.com/watch?v=P1ktul1v0To';
			break;
	}


	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

	const songInfo = await ytdl.getInfo(args);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}


}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);


