export const count = {
    description: 'Count to <count>',
    name: 'count',
    aliases: [],
    usage: null,
    cooldown: 5,
    permissionRequired: 0,
    reqArgs: false,
    guildOnly: false,
    async execute(commandQueue, _, msg, args) {
        let count = parseInt(args[0]);
        while (count >= 0) {
            const aux = count;
            commandQueue.push(
                function () {
                    msg.channel.send(aux);
                },
                aux * 1000
            );
            count--;
        }
    },
};
