import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const commands = [
    {
        name: 'zip',
        aliases: ['botzip', 'downloadbot', 'getbot', 'exportbot', 'zipbot'],
        description: 'Download the entire bot as a ZIP file (Owner only)',
        category: 'Owner',
        ownerOnly: true,
        execute: async ({ sock, from, text, msg, config }) => {
            const botName = config.BOT_NAME || 'Flash-MD';
            
            const creatingMsg = await t(from, 'zip', 'creating');
            const processingMsg = await sock.sendMessage(from, { text: creatingMsg }, { quoted: msg });
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const zipFileName = `${botName}-Backup-${timestamp}.zip`;
            const zipFilePath = path.join(process.cwd(), zipFileName);
            
            try {
                const output = fs.createWriteStream(zipFilePath);
                const archive = new ZipArchive({
                    zlib: { level: 9 }
                });
                
                output.on('close', async () => {
                    const fileSize = archive.pointer();
                    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
                    
                    await sock.sendMessage(from, { delete: processingMsg.key });
                    
                    if (fileSize > 50 * 1024 * 1024) {
                        const tooLargeMsg = await t(from, 'zip', 'tooLarge');
                        const poweredMsg = await t(from, 'zip', 'powered');
                        await sock.sendMessage(from, {
                            text: `${tooLargeMsg.replace('{size}', fileSizeMB)}\n\n${poweredMsg} ${botName}`
                        }, { quoted: msg });
                        
                        fs.unlinkSync(zipFilePath);
                        return;
                    }
                    
                    const successMsg = await t(from, 'zip', 'success');
                    const poweredMsg = await t(from, 'zip', 'powered');
                    
                    await sock.sendMessage(from, {
                        text: `${successMsg}\n\n📦 ${zipFileName}\n💾 ${fileSizeMB} MB\n📅 ${new Date().toLocaleString()}\n\n${poweredMsg} ${botName}`
                    }, { quoted: msg });
                    
                    const captionMsg = await t(from, 'zip', 'caption');
                    await sock.sendMessage(from, {
                        document: fs.readFileSync(zipFilePath),
                        fileName: zipFileName,
                        mimetype: 'application/zip',
                        caption: `${captionMsg}\nSize: ${fileSizeMB}MB`
                    }, { quoted: msg });
                    
                    fs.unlinkSync(zipFilePath);
                });
                
                archive.on('warning', function(err) {
                    if (err.code === 'ENOENT') {
                        console.warn('Archive warning:', err);
                    } else {
                        throw err;
                    }
                });
                
                archive.on('error', function(err) {
                    throw err;
                });
                
                archive.pipe(output);
                
                const directoriesToExclude = ['node_modules', '.git', 'temp', 'tmp', 'logs', 'sessions', 'backups', 'uploads', 'cache'];
                const filesToExclude = ['.env', '*.log', '*.zip', 'session.json', 'creds.json', 'package-lock.json'];
                
                archive.glob('**/*', {
                    cwd: process.cwd(),
                    ignore: directoriesToExclude.map(dir => `${dir}/**`).concat(filesToExclude),
                    dot: false
                });
                
                await archive.finalize();
                
            } catch (error) {
                console.error('Backup error:', error);
                await sock.sendMessage(from, { delete: processingMsg.key });
                const errorMsg = await t(from, 'zip', 'error');
                const poweredMsg = await t(from, 'zip', 'powered');
                await sock.sendMessage(from, {
                    text: `${errorMsg.replace('{error}', error.message)}\n\n${poweredMsg} ${botName}`
                }, { quoted: msg });
                
                if (fs.existsSync(zipFilePath)) {
                    fs.unlinkSync(zipFilePath);
                }
            }
        }
    }
];
