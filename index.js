const Discord = require ('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
var servers = {};

let args = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

client.login(token);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${prefix}greetings`)) {
		function play(connection, message) {
			var server = servers[message.guild.id];

			server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: "audioonly" }));

			server.queue.shift();

			server.dispatcher.on("end", function () {
				if (server.queue[0]) {
					play(connection, message);
				} else {
					connection.disconnect();
				}
			})
		}

		if (!message.member.voiceChannel) {
			message.channel.send('Je zit niet in een channel gekkie');
			return;
		}

		if (!servers[message.guild.id]) servers[message.guild.id] = {
			queue: []
		}

		var server = servers[message.guild.id];

		server.queue.push(args);

		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
			play(connection, message);
		})
	}
});


