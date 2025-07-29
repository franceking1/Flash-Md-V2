const now = require('performance-now');
const { franceking } = require('../main');

if (!global.botStartTime) global.botStartTime = Date.now();

function detectPlatform() {
    const hostEnv = process.env.HOST_PROVIDER?.toLowerCase();

    const providers = {
        'optiklink': 'Optiklink.com',
        'bot-hosting': 'Bot-Hosting.net',
        'heroku': 'Heroku',
        'railway': 'Railway',
        'koyeb': 'Koyeb',
        'render': 'Render',
        'github': 'GitHub Actions',
        'katabump': 'Katabump.com'
    };

    if (hostEnv && providers[hostEnv]) return providers[hostEnv];
    if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.KOYEB_ENV) return 'Koyeb';
    if (process.env.RENDER) return 'Render';
    if (process.env.GITHUB_WORKFLOW || process.env.GITHUB_ACTIONS) return 'GitHub Actions';
    if (process.env.DYNO) return 'Heroku';

    return 'Unknown (Linux)';
}

const getSenderId = (msg) => (msg.key?.participant || msg.key?.remoteJid || '0@s.whatsapp.net').split('@')[0];

const createQuotedContact = (senderId) => ({
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
        contactMessage: {
            displayName: 'IRON-MAN-MD',
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:IRON-MAN-MD\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
    },
});

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

module.exports = [
    {
        name: 'alive',
        get flashOnly() {
            return franceking();
        },
        aliases: ['status', 'bot'],
        description: 'Check if the bot is alive with uptime and ping.',
        category: 'General',
        execute: async (king, msg) => {
            const fromJid = msg.key.remoteJid;
            const senderId = getSenderId(msg);
            const start = now();

            const initialMsg = await king.sendMessage(fromJid, {
                text: '🔄 Checking bot status... alongside HULK'
            }, {
                quoted: createQuotedContact(senderId)
            });

            const latency = (now() - start).toFixed(0);
            await new Promise(res => setTimeout(res, 1000));

            const uptime = Date.now() - global.botStartTime;
            const formattedUptime = formatUptime(uptime);
            const platform = detectPlatform();
            const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

            const finalText = `🟢 *IRON-MAN-MD IS ONLINE*

*⏱️ Uptime:* ${formattedUptime}
*🏓 Ping:* ${latency} ms
*🖥️ Platform:* ${platform}
*💾 RAM Usage:* ${ramUsage} GB

_Type *!help* to view all available commands._`;

            await king.sendMessage(fromJid, {
                text: finalText,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363347365643318@newsletter',
                        newsletterName: 'IRON-MAN-MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: initialMsg });
        }
    }
];
