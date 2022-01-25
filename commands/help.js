import { prefix, permissions } from '../config.js';

export const help = {
    description: 'Displays commands and information about them.',
    name: 'help',
    aliases: [ 'man', 'manual', 'commands' ],
    usage: '<command_name>',
    cooldown: 5,
    permissionRequired: 0,
    reqArgs: false,
    guildOnly: false,
    execute(commandQueue, _, msg, args) {
        const { commands } = msg.client;
        let embed = { embed: {
            title: null,
            description: null,
            color: 0x32a8a8,
        }};
        if (!args.length) { /* general help */
            embed.embed.title = '❓ Bot commands';
            embed.embed.description = 'Here\'s all the available commands';
            embed.embed.fields = [];
            commands.map(command => {
                const aliases = command.aliases.length === 0 ? 'No aliases set' : command.aliases.join(' | ');
                let info = `${command.description}\n**Usage**: \`${prefix}${command.name}`
                    + ( command.usage !== null ? ` ${command.usage}\`` : '\`' )
                    + `\n**Aliases**: ${aliases}`;
                let field = {
                    name: `**${command.name}**`,
                    value: info
                };
                embed.embed.fields.push(field);
            });
        } else { /* command help */
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if (!command) { //TODO check alias/commands names for suggestions
                return msg.reply('that\'s not a valid command!');
            }
            embed.embed.title = `❓ \`${command.name}\` command usage and info`;
            embed.embed.description = command.description;
            const aliases = command.aliases.length === 0 ? 'No aliases set' : command.aliases.join(' | ');
            embed.embed.fields = [
                {
                    name: '**Usage**',
                    value: `\`${prefix}${command.name}` + ( command.usage !== null ? ` ${command.usage}\`` : '\`' ),
                },
                {
                    name: '**Aliases**',
                    value: `${aliases}`,
                },
                {
                    name: '**Cooldown**',
                    value: command.cooldown + ((command.cooldown || 3) === 1 ? 'second' : 'seconds'),
                },
                {
                    name: '**Permission Required**',
                    value: `${permissions[command.permissionRequired]} and above can execute this command`,
                },
                {
                    name: '**Server Only?**',
                    value: (command.guildOnly === true ? 'Yes' : 'No'),
                }
            ];
        }
        commandQueue.push(
            function () {
                msg.channel.send(embed);
            },
            0
        );
    },
};
