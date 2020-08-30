require('dotenv').config();
const { Client } = require('discord.js');
const { Greetings, Commands } = require('./keywords');
const { Functions } = require('./util/helper');

const client = new Client();
const PREFIX = '%';

// login
client.on('ready', () => {
    console.log(`${client.user.tag} is ready`);
});
client.login(process.env.BOT_TOKEN);

// message event listener
client.on('message', (message) => {
    const CONTENT = message.content;

    // console.log(`[${message.author.tag}: ${CONTENT}]`);

    // mitigating counting bot's own reply
    // to avoid a loop
    if (message.author.bot) return;

    // checking against our list of greetings
    if (Greetings.includes(CONTENT)) {
        message.channel.send(`Hello there!`);
    }

    // commands
    if (CONTENT.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = CONTENT.trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        console.log(message.author.tag, 'used command:', CMD_NAME, args);
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
                if (message.channel.type == 'text') {
                    const MEMBER = message.guild.members.cache.get(args[0]);
                    switch (CMD_NAME) {
                        case 'kick':
                            Functions.checkKickable(message, MEMBER);
                            break;
                        case 'ban':
                            Functions.checkBannable(message, MEMBER);
                            break;
                        case 'say':
                            message.channel.send(args.join(' '));
                            break;
                        default:
                            console.log(
                                'command received, could not parse command'
                            );
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
