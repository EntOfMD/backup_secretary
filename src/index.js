require("dotenv").config();
const { Client, WebhookClient } = require("discord.js");
const { Greetings, Commands, Functions, Constants } = require("./util/helper");

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
	console.log(`${client.user.tag} is ready`);
});

// message event listener
client.on("message", (message) => {
	const CONTENT = message.content;

	console.log(`[${message.author.tag}: ${CONTENT}]`);

	// mitigating counting bot's own reply
	// to avoid a loop
	if (message.author.bot) return;

	// checking against our list of greetings
	if (Greetings.includes(CONTENT)) {
		message.reply(`Hello there!`);
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
		if (args.length > 0) {
			// double checking the commands
			if (Commands.includes(CMD_NAME)) {
				if (message.channel.type == "text") {
					const MEMBER = message.guild.members.cache.get(args[0]);
					switch (CMD_NAME) {
						case "kick":
							Functions.checkKickable(message, MEMBER);
							break;
						case "ban":
							Functions.checkBannable(message, MEMBER);
							break;
						case "say":
							message.channel.send(args.join(" "));
							break;
						case "announce":
							webhookClient.send(args.join(" "));
							break;
						default:
							console.log("command received, could not parse command");
							return;
					}
				}
			} else {
				message.reply(
					"can't follow through homie, didn't catch that last part"
				);
			}
		}
	}
});

// reaction event listener
// ADD role
client.on("messageReactionAdd", (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);

	if (reaction.message.id === "749711465665003732") {
		switch (name) {
			//golang 749704008876294229
			case "🐉":
				member.roles.add("749704008876294229");
				console.log("Added Go role to", user.id);
				break;
			//javascript 749704270927888425
			case "🍌":
				member.roles.add("749704270927888425");
				console.log("Added JS role to", user.id);
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

	if (reaction.message.id === "749711465665003732") {
		switch (name) {
			//golang 749704008876294229
			case "🐉":
				member.roles.remove("749704008876294229");
				console.log("Removed Go role from", user.id);
				break;
			//javascript 749704270927888425
			case "🍌":
				member.roles.remove("749704270927888425");
				console.log("Removed JS role from", user.id);
				break;
			default:
				break;
		}
	}
});
