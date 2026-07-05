import CONFIG from '../config.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const styles = {
    10: {
        "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
        "a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ғ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ",
        "k": "ᴋ", "l": "ʟ", "m": "ᴍ", "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ϙ", "r": "ʀ", "s": "s", "t": "ᴛ",
        "u": "ᴜ", "v": "v", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ",
        "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ", "E": "ᴇ", "F": "ғ",
        "G": "ɢ", "H": "ʜ", "I": "ɪ", "J": "ᴊ", "K": "ᴋ", "L": "ʟ",
        "M": "ᴍ", "N": "ɴ", "O": "ᴏ", "P": "ᴘ", "Q": "ϙ", "R": "ʀ",
        "S": "s", "T": "ᴛ", "U": "ᴜ", "V": "v", "W": "ᴡ", "X": "x",
        "Y": "ʏ", "Z": "ᴢ"
    }
};

const applyStyle = (text) => {
    return text
        .split('')
        .map(c => styles[10][c] || c)
        .join('');
};

export const commands = [
    {
        name: 'categories',
        aliases: ['cats'],
        description: 'Show all available command categories.',
        category: 'General',

        execute: async ({ sock, from, msg, commands }) => {
            try {

                const grouped = {};

                for (const cmd of commands.values()) {

                    const category = (cmd.category || 'General')
                        .trim()
                        .toLowerCase();

                    if (!grouped[category]) {
                        grouped[category] = [];
                    }

                    grouped[category].push(cmd);
                }

                const categories = Object.keys(grouped).sort();

                const headerText = await t(from, 'categories', 'header');
                let text = `${headerText}\n\n`;

                categories.forEach((cat, index) => {
                    const formatted =
                        cat.charAt(0).toUpperCase() + cat.slice(1);

                    text += `${index + 1}. ${applyStyle(formatted)}\n`;
                });

                const useLabel = await t(from, 'categories', 'use');
                const generalLabel = await t(from, 'categories', 'general');
                const whatsappLabel = await t(from, 'categories', 'whatsapp');
                const userLabel = await t(from, 'categories', 'user');

                text += `\n${useLabel}\n`;
                text += `.category ${generalLabel}\n`;
                text += `.category ${whatsappLabel}\n`;
                text += `.category ${userLabel}`;

                await sock.sendMessage(from, {
                    text
                }, { quoted: msg });

            } catch (error) {

                console.error('Categories Error:', error);
                const errorMsg = await t(from, 'categories', 'error');
                await sock.sendMessage(from, {
                    text: errorMsg
                }, { quoted: msg });

            }
        }
    },

    {
        name: 'category',
        aliases: ['cat'],
        description: 'Show commands inside a category.',
        category: 'General',

        execute: async ({ sock, from, msg, commands, text }) => {
            try {

                if (!text) {
                    const provideMsg = await t(from, 'category', 'provideName');
                    return sock.sendMessage(from, {
                        text: provideMsg
                    }, { quoted: msg });
                }

                const grouped = {};

                for (const cmd of commands.values()) {

                    const category = (cmd.category || 'General')
                        .trim()
                        .toLowerCase();

                    if (!grouped[category]) {
                        grouped[category] = [];
                    }

                    grouped[category].push(cmd);
                }

                const input = text.trim().toLowerCase();

                const matchedCategory = Object.keys(grouped).find(
                    cat => cat === input
                );

                if (!matchedCategory) {
                    const notFoundMsg = await t(from, 'category', 'notFound');
                    return sock.sendMessage(from, {
                        text: `${notFoundMsg} "${text}"`
                    }, { quoted: msg });
                }

                const commandsList = grouped[matchedCategory]
                    .filter(cmd => cmd.name)
                    .sort((a, b) => a.name.localeCompare(b.name));

                const aliasesLabel = await t(from, 'category', 'aliases');
                
                let result = `${applyStyle(matchedCategory.toUpperCase())}\n\n`;

                commandsList.forEach((cmd, index) => {

                    result += `${index + 1}. ${applyStyle(cmd.name)}\n`;

                    if (cmd.description) {
                        result += `- ${cmd.description}\n`;
                    }

                    if (cmd.aliases && cmd.aliases.length) {
                        result += `- ${aliasesLabel}: ${cmd.aliases.join(', ')}\n`;
                    }

                    result += `\n`;
                });

                await sock.sendMessage(from, {
                    text: result
                }, { quoted: msg });

            } catch (error) {

                console.error('Category Error:', error);
                const errorMsg = await t(from, 'category', 'error');
                await sock.sendMessage(from, {
                    text: errorMsg
                }, { quoted: msg });

            }
        }
    }
];
