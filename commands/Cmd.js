import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const commands = [
    {
        name: 'findcmd',
        aliases: ['locate', 'where', 'cmdinfo', 'commandinfo'],
        description: 'Find which file a command is located in or get command details',
        category: 'General',
        execute: async ({ sock, from, text, msg, commands }) => {
            if (!text || text.trim() === '') {
                const noCommandMsg = await t(from, 'findcmd', 'noCommand');
                return sock.sendMessage(from, {
                    text: noCommandMsg
                }, { quoted: msg });
            }

            const searchTerm = text.trim().toLowerCase();
            let targetCommand = null;
            let targetCommandOriginalName = null;
            
            for (const [name, cmd] of commands) {
                if (name.toLowerCase() === searchTerm) {
                    targetCommand = cmd;
                    targetCommandOriginalName = name;
                    break;
                }
                if (cmd.aliases && cmd.aliases.some(alias => alias.toLowerCase() === searchTerm)) {
                    targetCommand = cmd;
                    targetCommandOriginalName = name;
                    break;
                }
            }
            
            const commandsDir = path.join(process.cwd(), 'commands');
            let commandFileLocation = 'Unknown';
            
            const findCommandInFile = (dir, commandName) => {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        const result = findCommandInFile(filePath, commandName);
                        if (result) return result;
                    } else if (file.endsWith('.js')) {
                        try {
                            const fileContent = fs.readFileSync(filePath, 'utf8');
                            const pattern = new RegExp(`name:\\s*['"](${commandName})['"]`, 'i');
                            if (pattern.test(fileContent)) {
                                return path.relative(process.cwd(), filePath);
                            }
                        } catch (err) {}
                    }
                }
                return null;
            };
            
            if (targetCommand && fs.existsSync(commandsDir)) {
                const found = findCommandInFile(commandsDir, targetCommandOriginalName);
                if (found) commandFileLocation = found;
            }
            
            if (targetCommand) {
                const headerText = await t(from, 'findcmd', 'header');
                const nameLabel = await t(from, 'findcmd', 'name');
                const aliasesLabel = await t(from, 'findcmd', 'aliases');
                const descLabel = await t(from, 'findcmd', 'description');
                const categoryLabel = await t(from, 'findcmd', 'category');
                const accessLabel = await t(from, 'findcmd', 'access');
                const fileLabel = await t(from, 'findcmd', 'fileLocation');
                const ownerOnlyText = await t(from, 'findcmd', 'ownerOnly');
                
                let infoText = `${headerText}\n\n`;
                infoText += `${nameLabel} ${targetCommand.name}\n`;
                if (targetCommand.aliases && targetCommand.aliases.length > 0) {
                    infoText += `${aliasesLabel} ${targetCommand.aliases.join(', ')}\n`;
                }
                infoText += `${descLabel} ${targetCommand.description || 'No description'}\n`;
                infoText += `${categoryLabel} ${targetCommand.category || 'General'}\n`;
                if (targetCommand.ownerOnly) {
                    infoText += `${accessLabel} ${ownerOnlyText}\n`;
                }
                infoText += `${fileLabel} ${commandFileLocation}\n`;
                
                await sock.sendMessage(from, { text: infoText }, { quoted: msg });
            } 
            else {
                const notFoundMsg = await t(from, 'findcmd', 'notFound');
                const exampleMsg = await t(from, 'findcmd', 'example');
                await sock.sendMessage(from, {
                    text: `${notFoundMsg} "${text}".\n\n${exampleMsg}`
                }, { quoted: msg });
            }
        }
    }
];
