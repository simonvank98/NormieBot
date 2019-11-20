const Discord = require ('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const ytdl = require('ytdl-core');

client.login(token);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${prefix}greetings`)) {
		if(!message.member.voiceChannel) return message.channel.send('Je zit niet in een channel gekkie');
		if(message.guild.me.voiceChannel) return message.channel.send('Ik ben al ergens anders Homos aan het roepen');
		let video = await ytdl.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
		let connection = await message.member.voiceChannel.join();
		let dispatcher = await connection.play(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter: 'audioonly' }));
		
		
		message.channel.send("Homo's :wave:");
	}
});
