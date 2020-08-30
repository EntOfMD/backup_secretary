const Greetings = [
    "g'day",
    'hello',
    'hi',
    'hey',
    'hiya',
    'howdy',
    'sup',
    'wassup',
    'yo',
];

const Commands = ['kick', 'ban', 'say', 'announce'];

const Functions = {
    // checks if the user is kickable and
    // kick them async
    checkKickable: (message, member) => {
        if (member) {
            member
                .kick()
                .then((member) =>
                    message.channel.send(`kicked ${member}. Adios!`)
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
};

module.exports = { Greetings, Commands, Functions };
