import { botDevChannelId } from '../config.js';

export const Logger = {

    TYPE : {
        ERR: "Error",
        WRN: "Warning",
        NFO: "Info",
        VRB: "Verbose",
    },

    dualLog(client, discordMsg, type, userResponse, devResponse = userResponse, err = null) {
        this.userLog(discordMsg, type, userResponse, err);
        this.devLog(client, type, devResponse, err);
    },

    userLog(discordMsg, type, response, errMsg) {

        let title;
        let userResponse = response;
        let color;

        switch (type) {
            case this.TYPE.ERR:
                title = '❌ **Error**';
                userResponse += ((errMsg !== undefined) ? '\n' + errMsg : '');
                color = 0xF52500;
                break;
            case this.TYPE.WRN:
                title = '⚠️ **Warning**';
                color = 0xFFEF23;
                break;
            case this.TYPE.NFO:
                title = 'ℹ️ **Info**';
                color = 0x0056F5;
                break;
            default:
                break;
        }

        // User response - same channel as command
        discordMsg.channel.send({ embed: {
            title: title,
            description: userResponse,
            color: color,
        }});
    },

    devLog(client, type, response, err) {

        let title;
        let devResponse = response;
        let color;

        switch (type) {
            case this.TYPE.ERR:
                title = '❌ **Error**';
                color = 0xF52500;
                break;
            case this.TYPE.WRN:
                title = '⚠️ **Warning**';
                color = 0xFFEF23;
                break;
            case this.TYPE.NFO:
                title = 'ℹ️ **Info**';
                color = 0x0056F5;
                break;
            default:
                break;
        }

        // Formats error for dev - **key**: value
        if (err) {
            let keys = Object.keys(err);
            let values = Object.values(err);
            devResponse += '\n\n';
            for (let i = 0; i < keys.length; i++) {
                devResponse += `**${keys[i]}**: ${values[i]}`;
                devResponse += (i !== keys.length - 1) ? '\n' : '';
            }
        }

        // Dev response - dedicated channel
        client.channels.cache.get(botDevChannelId).send({ embed: {
            title: title,
            description: devResponse,
            color: color,
        }});
    },
};
