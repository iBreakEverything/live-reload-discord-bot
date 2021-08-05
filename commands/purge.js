import { Logger } from "../util/logger.js";

const lowPurgeCount = 1;
const highPurgeCount = 500;

export const purge = {
    description: 'Deletes given ammount of messages',
    name: 'purge',
    aliases: [ 'prune' ],
    usage: '<count>',
    cooldown: 5,
    permissionRequired: 3,
    reqArgs: true,
    guildOnly: true,
    async execute(client, msg, args) {
        let count = parseInt(args[0]);
        if (isNaN(count)) {
            return Logger.userLog(msg, Logger.TYPE.ERR, 'Count must be a number');
        } else if (count < lowPurgeCount || count > highPurgeCount) {
            return Logger.userLog(msg, Logger.TYPE.ERR, `Count must be between ${lowPurgeCount} and ${highPurgeCount}`);
        }
        try {
            let toDelete = count;
            await msg.channel.bulkDelete(1, true);
            while(toDelete > 0) {
                await msg.channel.bulkDelete(Math.min(100, toDelete), true);
                toDelete -= 100;
            }
            let botMsg = await msg.channel.send(`Deleted ${count} messages`);
            botMsg.delete({ timeout:3000 });
        } catch (err) {
            return Logger.dualLog(client, msg, Logger.TYPE.ERR, `Could not delete ${Math.min(0, toDelete)} messages.`, `Failed to delete ${Math.min(0, toDelete)} messages.`, err);
        }
    },
};
