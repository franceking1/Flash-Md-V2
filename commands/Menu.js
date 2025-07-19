const { franceking } = require('../main');
const os = require('os');
const moment = require('moment-timezone');
const config = require('../config.js');
const axios = require('axios');

const startTime = Date.now();

const styles = {
    10: {
        "a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ғ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ",
        "k": "ᴋ", "l": "ʟ", "m": "ᴍ", "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ϙ", "r": "ʀ", "s": "s", "t": "ᴛ",
        "u": "ᴜ", "v": "v", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ",
        "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ", "E": "ᴇ", "F": "ғ", "G": "ɢ", "H": "ʜ", "I": "ɪ", "J": "ᴊ",
        "K": "ᴋ", "L": "ʟ", "M": "ᴍ", "N": "ɴ", "O": "ᴏ", "P": "ᴘ", "Q": "ϙ", "R": "ʀ", "S": "s", "T": "ᴛ",
        "U": "ᴜ", "V": "v", "W": "ᴡ", "X": "x", "Y": "ʏ", "Z": "ᴢ"
    }
};

const applyStyle = (text, styleNum) => {
    const map = styles[styleNum];
    return text.split('').map(c => map[c] || c).join('');
};

const formatUptime = ms => {
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
    return parts.join(', ');
};

const detectPlatform = () => {
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
};

const fetchRepoStats = async () => {
    try {
        const response = await axios.get('https://api.github.com/repos/Joshuamambo1/Zandile- Md-V2');
        const { forks_count, stargazers_count } = response.data;
        return {
            forks: forks_count || 0,
            stars: stargazers_count || 0
        };
    } catch {
        return { forks: 0, stars: 0 };
    }
};

module.exports = [
    {
        name: 'menu',
        get flashOnly() {
  return franceking();
},
        aliases: [],
        description: 'Displays categorized list of commands',
        category: 'General',
        execute: async (king, msg, args, fromJid, allCommands) => {
            const time = moment().tz(config.timezone || 'Africa/Lagos');
            const uptime = formatUptime(Date.now() - startTime);
            const platform = detectPlatform();
            const usedMem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
            const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const { forks, stars } = await fetchRepoStats();
            const users = (stars * 3) + (forks * 2);
            const usersFormatted = users.toLocaleString();
            const starsFormatted = stars.toLocaleString();
            const forksFormatted = forks.toLocaleString();
            const prefix = config.prefixes.join(', ') || '.';
            const botOwner = config.ON || 'Unknown';

            const categorized = {};
            for (const cmd of allCommands) {
                const category = cmd.category ? cmd.category.toUpperCase() : 'GENERAL';
                if (!categorized[category]) categorized[category] = [];
                categorized[category].push(cmd);
            }

            let text = `╭━━━❒ ${applyStyle("IRON-MAN-MD System INFO", 10)} ❒━━━╮\n`;
            text += `┃ 🧩 *Commands:* ${allCommands.length.toLocaleString()}\n`;
            text += `┃ 🪄 *Prefix:* ${prefix}\n`;
            text += `┃ ⏰ *Time:* ${time.format('HH:mm:ss')}\n`;
            text += `┃ 🌍 *Timezone:* ${config.timezone || 'Africa/Lagos'}\n`;
            text += `┃ 📅 *Date:* ${time.format('DD/MM/YYYY')}\n`;
            text += `┃ 🔋 *Uptime:* ${uptime}\n`;
            text += `┃ 💻 *Platform:* ${platform}\n`;
            text += `┃ 💾 *RAM:* ${usedMem}/${totalMem} GB\n`;
            text += `┃ 👥 *Users:* ${usersFormatted}\n`;
            text += `┃ 👑 *Owner:* ${botOwner}\n`;
            text += `╰━━━━━━❒ ${applyStyle("Version 2.5", 10)} ❒━━━━━╯\n\n`;

            let counter = 1;
            const sortedCategories = Object.keys(categorized).sort();
            for (const category of sortedCategories) {
                const commandsInCategory = categorized[category].filter(c => c.name);
                if (commandsInCategory.length === 0) continue;
                text += `*╭──❒ ${applyStyle(category, 10)} ❒───⊷*\n`;
                text += `│╭────────────\n`;
                for (const cmd of commandsInCategory) {
                    text += `││ ${counter++}. ${applyStyle(cmd.name, 10)}\n`;
                }
                text += `│╰────────────\n`;
                text += `╰══════════════⊷\n\n`;
            }

            await king.sendMessage(fromJid, {
                text,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: 'IRON-MAN-MD',
                        newsletterName: 'IRON-MAN--MD',
                        serverMessageId: -1
                    }
                }
            });
        }
    },

    {
        name: 'help',
        get flashOnly() {
  return franceking();
},
        aliases: ['list'],
        description: 'Provides help and guide for new users',
        category: 'General',
        execute: async (sock, msg, args, fromJid, allCommands) => {
            const prefix = Array.isArray(config.prefixes) && config.prefixes.length > 0 ? config.prefixes[0] : '.';
            let text = `*🛠️ IRON-MAN USER GUIDE*\n\n`;
            text += `To use the bot:\n`;
            text += `• Start commands with the prefix *${prefix}*\n`;
            text += `• Use ${prefix}menu to view all available commands\n`;
            text += `*COMMANDS LIST:*\n\n`;

            const categorized = {};
            for (const cmd of allCommands) {
                const category = cmd.category ? cmd.category.toUpperCase() : 'GENERAL';
                if (!categorized[category]) categorized[category] = [];
                categorized[category].push(cmd);
            }

            for (const [cat, cmds] of Object.entries(categorized)) {
            if (cmds.length === 0) continue;
                text += `📂 *${cat}*\n`;
                for (const cmd of cmds) {
                    text += `• *${cmd.name}* - ${cmd.description}`;
                    if (cmd.aliases && cmd.aliases.length > 0) {
                        text += ` (Aliases: ${cmd.aliases.join(', ')})`;
                    }
                    text += `\n`;
                }
                text += `\n`;
            }

            await sock.sendMessage(fromJid, {
                text,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363347365643318@newsletter',
                        newsletterName: 'IRON-MAN-MD',
                        serverMessageId: -1
                    }
                }
            });
        }
    }
];
