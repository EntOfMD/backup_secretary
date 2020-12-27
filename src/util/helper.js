const yargs = require("yargs");

const argv = yargs
	.env("BOT_TOKEN")
	.option("BOT_TOKEN", { alias: "t" })
	.option("GITHUB_WEBHOOK_ID", { alias: "ghwhid" })
	.option("GITHUB_WEBHOOK_TOKEN", { alias: "ghwhtk" }).argv;

const Constants = {
	env: {
		BOT_TOKEN: argv.BOT_TOKEN || process.env.BOT_TOKEN,
		GITHUB_WEBHOOK_ID: argv.GITHUB_WEBHOOK_ID || process.env.GITHUB_WEBHOOK_ID,
		GITHUB_WEBHOOK_TOKEN:
			argv.GITHUB_WEBHOOK_TOKEN || process.env.GITHUB_WEBHOOK_TOKEN,
	},
	threads: {
		PROGRAMMER_ROLE: "749711465665003732",
	},
	roles: {
		GO: "749704008876294229",
		JS: "749704270927888425",
	},
};

const Greetings = [
	"g'day",
	"hello",
	"hi",
	"hey",
	"hiya",
	"howdy",
	"sup",
	"wassup",
	"yo",
];

const Commands = ["kick", "ban", "say", "announce", "commands", "help"];

const Functions = {
	// checks if the user is kickable and
	// kick them async
	checkKickable: (message, member) => {
		if (member) {
			member
				.kick()
				.then((member) => message.channel.send(`kicked ${member}. Adios!`))
				.catch((err) => {
					message.reply(
						"I don't have authority to do that. Their power level is over 9000!"
					);
					throw err;
				});
		} else {
			message.reply("couldn't find that user");
		}
	},
	// checks if the user is bannable and
	// ban them async
	checkBannable: (message, member) => {
		if (member) {
			member
				.ban()
				.then((member) =>
					message.channel.send(`banned ${member}. good riddance`)
				)
				.catch((err) => {
					message.reply(
						"I don't have authority to do that. Their power level is over 9000!"
					);
					throw err;
				});
		} else {
			message.reply("couldn't find that user");
		}
	},
	// returns a list of commands
	listCommands: (message) => {
		if (message) {
			test = [``];
			return message.reply("Available commands:\n" + Commands);
		}
	},
};

module.exports = { Greetings, Commands, Functions, Constants };
