import { Logger } from '../util/logger.js';

const lowPurgeCount = 1;
const highPurgeCount = 100;

export const purge = {
    description: 'Deletes given ammount of messages\nCan delete older messages using 2nd argument',
    name: 'purge',
    aliases: [ 'prune' ],
    usage: '<count> <true?>',
    cooldown: 5,
    permissionRequired: 3,
    reqArgs: true,
    guildOnly: true,
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').Message} msg 
     * @param {*} args 
     * @returns 
     */
    async execute(client, msg, args) {
        const count = parseInt(args[0]);
        const deleteOld = args[1] === 'true' ? true : false;
        if (isNaN(count)) {
            return Logger.userLog(msg, Logger.TYPE.ERR, 'Count must be a number');
        } else if (count < lowPurgeCount || count > highPurgeCount) {
            return Logger.userLog(msg, Logger.TYPE.ERR, `Count must be between ${lowPurgeCount} and ${highPurgeCount}`);
        }
        try {
            if (!deleteOld) {
                await msg.channel.bulkDelete(1, true);  // Delete command
                let delCount = await msg.channel.bulkDelete(Math.max(highPurgeCount, count), true);
                await msg.channel.send(`Deleted ${delCount.size} messages`).then(msg => msg.delete({ timeout:3000 }));
            } else {
                await msg.channel.bulkDelete(1, true);  // Delete command
                let msgs = await msg.channel.messages.fetch({ limit: count });
                for (let [key, _] of msgs) {
                    msgs.get(key).delete();  // FIXME add to queue
                }
                msg.channel.send(`Deleting ${msgs.size} messages...`).then(msg => msg.delete({ timeout:3000 }));
            }
        } catch (err) {
            return Logger.dualLog(client, msg, Logger.TYPE.ERR, `Could not delete ${count} messages.`, `Failed to delete ${count} messages.`, err);
        }
    },
};
