const { Client, WebhookClient, MessageEmbed } = require("discord.js");
const { Functions } = require("./util/functions");
const { Constants, Greetings, Commands } = require("./util/constants");

// discord.js uses cached set of data,
// beginning from when the bot was last online.
// use partials to access data that isn't cached.
const client = new Client({
	partials: ["MESSAGE", "REACTION"],
});
const webhookClient = new WebhookClient(
	Constants.env.GITHUB_WEBHOOK_ID,
	Constants.env.GITHUB_WEBHOOK_TOKEN
);
const PREFIX = "%";

// login
client.login(Constants.env.BOT_TOKEN);
client.on("ready", () => {
	client.user
		.setActivity("%help", {
			type: "LISTENING",
			url: "https://entofmd.io",
		})
		.then((presence) => {
			if (presence.status === "online") {
				console.log(`${client.user.tag} is ready`);
			}
		})
		.catch(console.error);
});

// message event listener
client.on("message", (message) => {
	const CONTENT = message.content;

	console.log(`[${message.author.tag}: ${CONTENT}]`);

	// mitigating counting bot's own reply
	// to avoid a loop
	if (message.author.bot) return;

	// checking a list of greetings
	// to see if the greet is recognized
	if (Greetings.includes(CONTENT.toLowerCase())) {
		message.reply(`Hello there!`);
		message.react("👋");
	}

	// commands
	if (CONTENT.startsWith(PREFIX)) {
		const [CMD_NAME, ...args] = CONTENT.trim()
			.substring(PREFIX.length)
			.split(/\s+/);

		console.log(message.author.tag, "used command:", CMD_NAME, args);
		/* TODO
        handle channel vs DM
         - the bot gets events from channel and DM all the same.
         - DM doesn't have channel methods
         - channel doesn't have DM methods
         - currently the bot would crash if someone were to DM a command
          - because 'member' is searching cached server user listing
         */
		if (Commands.includes(CMD_NAME.toLowerCase())) {
			if (message.channel.type == "text") {
				//this is for channel messages
				const MEMBER = message.guild.members.cache.get(args[0]);

				switch (CMD_NAME.toLowerCase()) {
					case "kick":
						Functions.checkKickable(message, MEMBER);
						message.react("☑️");
						break;
					case "ban":
						Functions.checkBannable(message, MEMBER);
						message.react("☑️");
						break;
					case "say":
						message.channel.send(args.join(" "));
						message.react("☑️");
						break;
					case "announce":
						webhookClient.send(args.join(" "));
						message.react("☑️");
						break;
					case "commands":
					case "help":
						Functions.listCommands(message);
						message.react("☑️");
						break;
					default:
						console.log("command received, could not parse command");
						return;
				}
			} else if (message.channel.type == "dm") {
				// this is for DMs
			}
		} else if (Commands.includes(CMD_NAME)) {
			message.reply("invalid arugments");
		} else {
			// message.reply("invalid command");
			Functions.listCommands(message);
		}
	}
});

// reaction event listener
// ADD role
client.on("messageReactionAdd", (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);

	if (reaction.message.id === Constants.threads.PROGRAMMER_ROLE) {
		switch (name) {
			case "🐉":
				member.roles.add(Constants.roles.GO);
				console.log("Added Go role to", user.tag);
				break;
			case "🍌":
				member.roles.add(Constants.roles.JS);
				console.log("Added JS role to", user.tag);
				break;
			default:
				break;
		}
	}
});

// reaction event listener
// REMOVE role
client.on("messageReactionRemove", (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);

	if (reaction.message.id === Constants.threads.PROGRAMMER_ROLE) {
		switch (name) {
			case "🐉":
				member.roles.remove(Constants.roles.GO);
				console.log("Removed Go role from", user.tag);
				break;
			case "🍌":
				member.roles.remove(Constants.roles.JS);
				console.log("Removed JS role from", user.tag);
				break;
			default:
				break;
		}
	}
});

// mentioning channel name
// client.on("message", (message) => {
// 	if (!message.content.startsWith(PREFIX)) return;

// 	let channelName = message.channel.name;
// 	const [CMD_NAME, ...args] = message.content
// 		.trim()
// 		.substring(PREFIX.length)
// 		.split(/[^0-9a-zA-Z]|[\/s\\]/);

// 	if (channelName === "bot-dev") {
// 		if (
// 			message.mentions.channels.array().length > 0 &&
// 			args.includes(message.channel.id)
// 		) {
// 			channel_id = message.mentions.channels.first().id;
// 			console.log(CMD_NAME, args);

// 			message.reply("Hi!");
// 		} else {
// 			const channelError = new MessageEmbed()
// 				.setTitle("Huh? Oh!")
// 				.setDescription(
// 					"Hey there! You forgot to mention a channel! You don't know how?!? Do `#channelname`!"
// 				);
// 			message.channel.send(channelError);
// 		}
// 	}
// });

// When a new member joins
client.on("guildMemberAdd", (member) => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(
		(ch) => ch.name === "bot-dev"
	);
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to the server, ${member}`);
});

client.on("disconnect", () => {
	console.log("disconnected");
});
