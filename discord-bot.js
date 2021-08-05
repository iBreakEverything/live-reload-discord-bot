import { readdirSync } from 'fs';
import { Client, Collection } from 'discord.js';
import { token, prefix, botDevChannelId } from './config.js';
import { Logger } from './util/logger.js'

const client = new Client();
const cooldowns = new Collection();

importCommands();

client.on('ready', () => {
    console.log('Online');
});

client.on('message', msg => {  //FIXME
    if (!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (commandName === "reload") {
        let oldCommands = client.commands.map(x => x.name);
        msg.reply("Reloading...")
        .then(importCommands())
        .then(reply => {
            let desc = '';
            let newCommands = client.commands.map(x => x.name)
            let oldCommandList = oldCommands.filter(x => !newCommands.includes(x));
            let newCommandList = newCommands.filter(x => !oldCommands.includes(x));

            if (newCommandList.length !== 0) {
                let gained = newCommandList.reduce((x,y) => {return x += ", " + y});
                desc += `\n**New commands**: ${gained}`
            }

            if (oldCommandList.length !== 0) {
                let lost = oldCommandList.reduce((x,y) => {return x += ", " + y});
                desc += `\n**Removed commands**: ${lost}`;
            }

            if (newCommandList.length === 0 && oldCommandList.length === 0) {
                desc += '\nNo changes.'
            }

            reply.edit({
            embed: {
                title: 'Changes',
                description: desc,
                color: 0x4aa444,
                timestamp: new Date()
            }})
        });
        //console.log(reply);
        return;
    }

    if (!command) {
        return Logger.userLog(msg, Logger.TYPE.WRN, `\`${prefix}${commandName}\` does not exists.`); //TODO check alias/commands names for suggestions
    }

    if (command.guildOnly && msg.channel.type !== 'text') {
        return Logger.userLog(msg, Logger.TYPE.WRN, 'Fuck you.');
    }

    if (command.reqArgs && !args.length) {
        let description = 'Missing arguments';
        if (command.usage) {
            description += `\nCommand usage: \`${prefix}${command.name} ${command.usage}\``;
        }
        return Logger.userLog(msg, Logger.TYPE.NFO, description);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            let secLeft = Math.ceil(timeLeft);
            let message = `🖕 don't spam you little shit! Wait ${secLeft} more second`
            if (timeLeft > 1) {
                message += 's';
            }
            message += ` before reusing the \`${prefix}${command.name}\` command.`;
            return Logger.userLog(msg, Logger.TYPE.WRN, message);
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    try {
        command.execute(client, msg, args);
    } catch (err) {
        return Logger.dualLog(client, msg, Logger.TYPE.ERR, `Failed to execute \`${prefix}${command.name}\``, `Failed to execute ${prefix}${command.name}`, err);
    }

});

client.login(token);

async function importCommands() {
    const ext = '.js';
    const commandFiles = readdirSync('./commands').filter(file => file.endsWith(ext));
    client.commands = new Collection();
    for (const file of commandFiles) {
        let command = await import(`./commands/${file}`);
        let filename = file.substring(0, file.length - ext.length);
        client.commands.set(command[filename].name, command[filename]);
    }
}

function startAtTime(h = 0, m = 0, s = 0){
    var d = new Date();
    return (-d + d.setHours(h,m,s,0));
}