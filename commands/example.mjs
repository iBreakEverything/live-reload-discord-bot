import { Logger } from "../util/logger.js";
export const example = {
    description: 'example description',
    name: 'example',
    aliases: [ 'ex' ],
    usage: null,
    cooldown: 5,
    permissionRequired: 0,
    reqArgs: false,
    guildOnly: false,
    async execute(client, msg, args) {
        msg.channel.send({ embed: {
            title: '❕ **Example**',
            description: 'This is an example.',
            color: 0x000000,
        }});
        Logger.dualLog(client, msg, Logger.TYPE.NFO, 'This is a logger test.');
    },
};
