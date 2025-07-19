const now = require('performance-now');
const { franceking } = require('../main');
if (!global.botStartTime) global.botStartTime = Date.now();

module.exports = [
    {
        name: 'ping',
        get flashOnly() {
  return franceking();
},
        aliases: ['latency', 'speed'],
        description: "Checks the bot's response time",
        execute: async (sock, msg) => {
            const start = now();
            const senderId = (msg.key?.participant || msg.key?.remoteJid || '0@s.whatsapp.net').split('@')[0];
            const jid = msg.key.remoteJid;

            const pingMsg = await sock.sendMessage(jid, { text: 'Pinging...' }, {
                quoted: {
                    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
                    message: {
                        contactMessage: {
                            displayName: 'IRON-MAN-MD',
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'IRON-MAN-MD'\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                        },
                    },
                }
            });

            const latency = (now() - start).toFixed(0);

            await sock.relayMessage(
                jid,
                {
                    protocolMessage: {
                        key: pingMsg.key,
                        type: 14,
                        editedMessage: {
                            conversation: `🏓 Pong!\n⏱️ *IRON-MAN-MD-MV2.5 Speed: ${latency} ms_*`,
                        },
                    },
                },
                {}
            );
        }
    },
    {
        name: 'uptime',
        get flashOnly() {
  return franceking();
},
        aliases: ['runtime'],
        description: 'Displays the system uptime!',
        execute: async (sock, msg) => {
            const currentTime = Date.now();
            const uptimeInMillis = currentTime - global.botStartTime;
            const formatted = formatUptime(uptimeInMillis);

            const senderId = (msg.key?.participant || msg.key?.remoteJid || '0@s.whatsapp.net').split('@')[0];
            const jid = msg.key.remoteJid;

            await sock.sendMessage(jid, {
                text: `*_UPTIME OF FLASH-MD-V2: ${formatted}_*`
            }, {
                quoted: {
                    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
                    message: {
                        contactMessage: {
                            displayName: 'IRON-MAN-MD',
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'IRON-MAN-MD-V2'\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                        },
                    },
                }
            });
        }
    }
];

function formatUptime(ms) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / (1000 * 60)) % 60;
    const hr = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const day = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];

    if (day === 1) parts.push(`1 day`);
    else if (day > 1) parts.push(`${day} days`);

    if (hr === 1) parts.push(`1 hour`);
    else if (hr > 1) parts.push(`${hr} h`);

    if (min === 1) parts.push(`1 minute`);
    else if (min > 1) parts.push(`${min} m`);

    if (sec === 1) parts.push(`1 second`);
    else if (sec > 1 || parts.length === 0) parts.push(`${sec} s`);

    return parts.join(', ') || '0 second';
}
