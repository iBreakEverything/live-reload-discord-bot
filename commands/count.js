export const count = {
    description: 'Count to <count>',
    name: 'count',
    aliases: [],
    usage: null,
    cooldown: 5,
    permissionRequired: 0,
    reqArgs: false,
    guildOnly: false,
    async execute(_, msg, args) {
        let count = parseInt(args[0]);
        while (count > 0) {
            msg.channel.send(count--);  // FIXME add to queue
        }
    },
};
