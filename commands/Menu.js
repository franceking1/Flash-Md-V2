import os from 'os';
import moment from 'moment-timezone';
import axios from 'axios';
import CONFIG from '../config.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const startTime = Date.now();

const styles = {
    10: {
        "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
        "a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ғ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ",
        "k": "ᴋ", "l": "ʟ", "m": "ᴍ", "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ϙ", "r": "ʀ", "s": "s", "t": "ᴛ",
        "u": "ᴜ", "v": "v", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ", "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ",
        "E": "ᴇ", "F": "ғ", "G": "ɢ", "H": "ʜ", "I": "ɪ", "J": "ᴊ", "K": "ᴋ", "L": "ʟ", "M": "ᴍ", "N": "ɴ",
        "O": "ᴏ", "P": "ᴘ", "Q": "ϙ", "R": "ʀ", "S": "s", "T": "ᴛ", "U": "ᴜ", "V": "v", "W": "ᴡ", "X": "x",
        "Y": "ʏ", "Z": "ᴢ"
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

    return 'PANEL';
};

const fetchRepoStats = async () => {
    try {
        const response = await axios.get('https://api.github.com/repos/franceking1/Flash-Md-V3');

        const { forks_count, stargazers_count } = response.data;

        return {
            forks: forks_count || 0,
            stars: stargazers_count || 0
        };

    } catch {
        return {
            forks: 0,
            stars: 0
        };
    }
};

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

export const commands = [
    {
        name: 'menu',
        aliases: ['list'],
        description: 'Show all available bot commands.',
        category: 'General',

        execute: async ({ sock, from, msg, commands, auteurMessage, nomAuteurMessage }) => {
            try {

                const botName = 'FLASH-MD-V3';
                const botVersion = CONFIG.BOT_VERSION || '3.0.0';
                const ownerName = CONFIG.OWNER_NAME || 'FRANCE KING';
                const tz = CONFIG.TZ || 'Africa/Nairobi';
                const prefix = CONFIG.PREFIXES?.[0] || ' ';
                const mode = CONFIG.MODE === 'public' ? 'Public' : 'Private';
                const menuImages = CONFIG.MENU_IMAGES || [];

                const list = Array.from(commands.values());

                if (!list.length) {
                    return sock.sendMessage(from, {
                        text: '❌ Command list not available.'
                    }, { quoted: msg });
                }

                const time = moment().tz(tz);
                const hour = time.hour();

                let greeting = "Good Night";

                if (hour >= 0 && hour <= 11) {
                    greeting = "Good Morning";
                } else if (hour >= 12 && hour <= 16) {
                    greeting = "Good Afternoon";
                } else if (hour >= 16 && hour <= 21) {
                    greeting = "Good Evening";
                }

                const userName = nomAuteurMessage || auteurMessage || ownerName;

                const uptime = formatUptime(Date.now() - startTime);
                const platform = detectPlatform();

                const usedMem = (
                    (os.totalmem() - os.freemem()) /
                    1024 /
                    1024 /
                    1024
                ).toFixed(2);

                const totalMem = (
                    os.totalmem() /
                    1024 /
                    1024 /
                    1024
                ).toFixed(2);

                const { forks, stars } = await fetchRepoStats();

                const users = (stars * 3) + (forks * 2);
                const usersFormatted = users.toLocaleString();

                const grouped = {};

                for (const cmd of list) {
                    const category = cmd.category || 'General';

                    if (!grouped[category]) {
                        grouped[category] = [];
                    }

                    grouped[category].push(cmd);
                }

                let menuText = `*${greeting} ${userName}*\n\n`;

                menuText += `╭━━━❒ ${applyStyle(`${botName} ${botVersion}`, 10)} ❒━━━╮\n`;
                menuText += `┃❃╭────────────────\n`;
                menuText += `┃❃│ *Owner:* ${ownerName}\n`;
                menuText += `┃❃│ *Prefix:* ${prefix}\n`;
                menuText += `┃❃│ *Commands:* ${list.length}\n`;
                menuText += `┃❃│ *Time:* ${time.format('HH:mm:ss')}\n`;
                menuText += `┃❃│ *Date:* ${time.format('DD/MM/YYYY')}\n`;
                menuText += `┃❃│ *Mode:* ${mode}\n`;
                menuText += `┃❃│ *Timezone:* ${tz}\n`;
                menuText += `┃❃│ *Total Users:* ${usersFormatted}\n`;
                menuText += `┃❃│ *RAM:* ${usedMem}/${totalMem} GB\n`;
                menuText += `┃❃│ *Uptime:* ${uptime}\n`;
                menuText += `┃❃│ *Platform:* ${platform}\n`;
                menuText += `┃❃╰────────────────\n`;
                menuText += `╰━━━━━❒ ${applyStyle(`VERSION ${botVersion}`, 10)} ❒━━━━╯\n\n`;

                menuText += `*◇ ${botName} COMMANDS ◇*\n\n`;

                let counter = 1;

                const sortedCategories = Object.keys(grouped).sort();

                for (const category of sortedCategories) {

                    const commandsInCategory = grouped[category]
                        .filter(c => c.name)
                        .sort((a, b) => a.name.localeCompare(b.name));

                    if (commandsInCategory.length === 0) continue;

                    menuText += `*╭──❒ ${applyStyle(category.toUpperCase(), 10)} ❒───⊷*\n`;
                    menuText += `│╭────────────\n`;

                    for (const cmd of commandsInCategory) {
                        menuText += `││ ${counter++}. ${applyStyle(cmd.name, 10)}\n`;
                    }

                    menuText += `│╰────────────\n`;
                    menuText += `╰══════════════⊷\n\n`;
                }

                menuText += `${readmore}\n`;
                menuText += `◇ *THE FLASH MULTI DEVICE* ◇\n\n`;
                menuText += `   *Released: 22.2.2024*\n\n`;
                menuText += ` _Thanks For choosing ${botName}_\n\n`;
                menuText += `  Created by *${ownerName} ©2024*\n\n`;
                menuText += `     *KEEP USING ${botName}*\n`;

                const defaultMedia = [
                    'https://picsum.photos/700/900',
                    'https://h.uguu.se/qhKuTfqE.mp4'
                ];

                const allMedia = [...defaultMedia, ...menuImages];

                const randomImage = allMedia[
                    Math.floor(Math.random() * allMedia.length)
                ];

                const isVideo = randomImage.endsWith('.mp4');

                try {

                    await sock.sendMessage(from, {
                        ...(isVideo
                            ? { video: { url: randomImage } }
                            : { image: { url: randomImage } }),

                        caption: menuText,

                        contextInfo: {
                            mentionedJid: [userName],
                            forwardingScore: 1,
                            isForwarded: true,

                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363238139244263@newsletter',
                                newsletterName: botName,
                                serverMessageId: -1
                            }
                        }

                    }, { quoted: msg });

                } catch {

                    await sock.sendMessage(from, {
                        text: menuText,

                        contextInfo: {
                            mentionedJid: [userName],
                            forwardingScore: 1,
                            isForwarded: true,

                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363238139244263@newsletter',
                                newsletterName: botName,
                                serverMessageId: -1
                            }
                        }

                    }, { quoted: msg });
                }

            } catch (error) {

                console.error('Menu error:', error);

                await sock.sendMessage(from, {
                    text: '❌ Error loading menu.'
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'help',
        aliases: ['guide'],
        description: 'Show command details with descriptions and aliases.',
        category: 'General',

        execute: async ({ sock, from, text, msg, commands, auteurMessage, nomAuteurMessage }) => {
            try {

                const botName = 'FLASH-MD-V3';
                const botVersion = CONFIG.BOT_VERSION || '3.0.0';
                const ownerName = CONFIG.OWNER_NAME || 'FRANCE KING';
                const tz = CONFIG.TZ || 'Africa/Nairobi';
                const prefix = CONFIG.PREFIXES?.[0] || ' ';

                const list = Array.from(commands.values());

                if (!list.length) {
                    const noCommandsMsg = await t(from, 'help', 'noCommands');
                    return sock.sendMessage(from, {
                        text: noCommandsMsg
                    }, { quoted: msg });
                }

                const time = moment().tz(tz);
                const hour = time.hour();

                let greeting = "Good Night";

                if (hour >= 0 && hour <= 11) {
                    greeting = "Good Morning";
                } else if (hour >= 12 && hour <= 16) {
                    greeting = "Good Afternoon";
                } else if (hour >= 16 && hour <= 21) {
                    greeting = "Good Evening";
                }

                const userName = nomAuteurMessage || auteurMessage || ownerName;

                const greetingMsg = await t(from, 'help', 'greeting');
                const ownerLabel = await t(from, 'help', 'owner');
                const prefixLabel = await t(from, 'help', 'prefix');
                const timeLabel = await t(from, 'help', 'time');
                const dateLabel = await t(from, 'help', 'date');
                const tzLabel = await t(from, 'help', 'timezone');
                const noDescMsg = await t(from, 'help', 'noDescription');
                const aliasesLabel = await t(from, 'help', 'aliases');
                const usageMsg = await t(from, 'help', 'usage');
                const poweredMsg = await t(from, 'help', 'powered');

                let helpText = `${greetingMsg} ${userName}\n\n`;

                helpText += `╭━━━❒ ${applyStyle(`${botName}`, 10)} ❒━━━╮\n`;
                helpText += `┃❃╭────────────────\n`;
                helpText += `┃❃│ *${ownerLabel}:* ${ownerName}\n`;
                helpText += `┃❃│ *${prefixLabel}:* ${prefix}\n`;
                helpText += `┃❃│ *${timeLabel}:* ${time.format('HH:mm:ss')}\n`;
                helpText += `┃❃│ *${dateLabel}:* ${time.format('DD/MM/YYYY')}\n`;
                helpText += `┃❃│ *${tzLabel}:* ${tz}\n`;
                helpText += `┃❃╰────────────────\n`;
                helpText += `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

                helpText += `*FLASH-MD V3 COMMANDS*\n\n`;

                const grouped = {};

                for (const cmd of list) {
                    const category = cmd.category || 'General';

                    if (!grouped[category]) {
                        grouped[category] = [];
                    }

                    grouped[category].push(cmd);
                }

                const sortedCategories = Object.keys(grouped).sort();

                for (const category of sortedCategories) {

                    const commandsInCategory = grouped[category]
                        .filter(c => c.name)
                        .sort((a, b) => a.name.localeCompare(b.name));

                    if (commandsInCategory.length === 0) continue;

                    helpText += `╭──❒ ${applyStyle(category.toUpperCase(), 10)} ❒───⊷\n`;
                    helpText += `│\n`;

                    for (const cmd of commandsInCategory) {

                        helpText += `│ • *${applyStyle(cmd.name, 10)}*\n`;
                        helpText += `│   ↳ ${cmd.description || noDescMsg}\n`;

                        if (cmd.aliases && cmd.aliases.length > 0) {
                            helpText += `│   ↳ ${aliasesLabel}: ${cmd.aliases.map(a => applyStyle(a, 10)).join(', ')}\n`;
                        }

                        helpText += `│\n`;
                    }

                    helpText += `╰══════════════⊷\n\n`;
                }

                helpText += `${usageMsg} ${prefix}<command>\n`;
                helpText += `${poweredMsg} ${botName} ${botVersion}`;

                await sock.sendMessage(from, {
                    text: helpText,

                    contextInfo: {
                        mentionedJid: [userName],
                        forwardingScore: 1,
                        isForwarded: true,

                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363238139244263@newsletter',
                            newsletterName: botName,
                            serverMessageId: -1
                        }
                    }

                }, { quoted: msg });

            } catch (error) {

                console.error('Help error:', error);
                const errorMsg = await t(from, 'help', 'error');
                await sock.sendMessage(from, {
                    text: errorMsg
                }, { quoted: msg });
            }
        }
    }
];
