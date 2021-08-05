export const ping = {
    description: 'Pong!',
    name: 'ping',
    aliases: [ 'pong', 'latency', 'uptime' ],
    usage: null,
    cooldown: 5,
    permissionRequired: 0,
    reqArgs: false,
    guildOnly: false,
    async execute(client, msg, args) {
        let botMsg = await msg.channel.send('〽️ Pinging...');
        botMsg.edit('🏓').then(
        botMsg.edit({ embed: {
            title: 'Ping',
            description: [
            `**Server**: ${botMsg.createdAt - msg.createdAt}ms`,
            `**API**: ${Math.round(client.ws.ping)}ms`,
            `**Uptime**:  ${msToTime(client.uptime)}`
            ].join('\n'),
            color: 0x4aa444,
            timestamp: new Date()
        }})
        .catch((err) => {
            botMsg.delete({ timeout: 3000 });
            Logger.dualLog(client, msg, Logger.TYPE.ERR, 'Could not send/edit message.', 'Failure on ping message edit.', err);
        }));
    },
};

function msToTime(ms) {
    let days = Math.floor(ms / 86400000); // 24*60*60*1000
    let daysms = ms % 86400000; // 24*60*60*1000
    let hours = Math.floor(daysms / 3600000); // 60*60*1000
    let hoursms = ms % 3600000; // 60*60*1000
    let minutes = Math.floor(hoursms / 60000); // 60*1000
    let minutesms = ms % 60000; // 60*1000
    let sec = Math.floor(minutesms / 1000);

    let str = '';
    if (days) {
        str += days + 'd ';
    }
    if (hours) {
        str += hours + 'h ';
    }
    if (minutes) {
        str += minutes + 'm ';
    }
    if (sec) {
        str += sec + 's';
    }
    return str;
}
