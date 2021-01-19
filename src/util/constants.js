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

const Commands = ["kick", "ban", "say", "announce", "commands", "help"];

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

module.exports = { Constants, Commands, Greetings };
