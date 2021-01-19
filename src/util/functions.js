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
	splitLines: (s) => {
		return s.split(/\r\n|\r|\n/);
	},
};

module.exports = { Functions };
