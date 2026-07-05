import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const commands = [
    {
        name: 'structure',
        aliases: ['tree'],
        description: 'Analyze the complete structure, files, and folders of the bot',
        category: 'Owner',
        ownerOnly: true,
        execute: async ({ sock, from, text, msg, config }) => {
            const botName = config.BOT_NAME || 'Flash-MD';
            
            const args = text.trim().split(/\s+/);
            const option = args[0]?.toLowerCase() || '';
            
            if (option === 'help') {
                const helpTitle = await t(from, 'structure', 'helpTitle');
                const cmdDefault = await t(from, 'structure', 'cmdDefault');
                const cmdTree = await t(from, 'structure', 'cmdTree');
                const cmdDetails = await t(from, 'structure', 'cmdDetails');
                const cmdSize = await t(from, 'structure', 'cmdSize');
                const cmdFiles = await t(from, 'structure', 'cmdFiles');
                const cmdTreeAlias = await t(from, 'structure', 'cmdTreeAlias');
                const poweredMsg = await t(from, 'structure', 'powered');
                
                return sock.sendMessage(from, {
                    text: `${helpTitle}\n\n` +
                          `${cmdDefault}\n` +
                          `${cmdTree}\n` +
                          `${cmdDetails}\n` +
                          `${cmdSize}\n` +
                          `${cmdFiles}\n` +
                          `${cmdTreeAlias}\n\n` +
                          `${poweredMsg} ${botName}`
                }, { quoted: msg });
            }
            
            const analyzingMsg = await t(from, 'structure', 'analyzing');
            const processingMsg = await sock.sendMessage(from, { text: analyzingMsg }, { quoted: msg });
            
            try {
                const rootDir = process.cwd();
                const excludeDirs = ['node_modules', '.git', 'temp', 'tmp', 'logs', 'sessions', 'backups', 'uploads', 'cache', 'sessions', 'venv', 'env', '__pycache__'];
                const excludeFiles = ['.env', '*.log', '*.zip', 'session.json', 'creds.json', 'package-lock.json', 'yarn.lock'];
                
                const structure = {
                    totalFiles: 0,
                    totalFolders: 0,
                    totalSize: 0,
                    byExtension: {},
                    byFolder: {},
                    files: [],
                    tree: ''
                };
                
                const generateTree = (dir, prefix = '', isLast = true) => {
                    if (!fs.existsSync(dir)) return '';
                    
                    const items = fs.readdirSync(dir).filter(item => {
                        const itemPath = path.join(dir, item);
                        const stat = fs.statSync(itemPath);
                        if (stat.isDirectory()) {
                            return !excludeDirs.includes(item) && !item.startsWith('.');
                        }
                        const ext = path.extname(item).toLowerCase();
                        const shouldExclude = excludeFiles.some(pattern => {
                            if (pattern.includes('*')) {
                                const regex = new RegExp(pattern.replace('*', '.*'));
                                return regex.test(item);
                            }
                            return item === pattern;
                        });
                        return !shouldExclude;
                    });
                    
                    items.sort((a, b) => {
                        const aPath = path.join(dir, a);
                        const bPath = path.join(dir, b);
                        const aIsDir = fs.statSync(aPath).isDirectory();
                        const bIsDir = fs.statSync(bPath).isDirectory();
                        if (aIsDir && !bIsDir) return -1;
                        if (!aIsDir && bIsDir) return 1;
                        return a.localeCompare(b);
                    });
                    
                    let treeString = '';
                    
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const itemPath = path.join(dir, item);
                        const stat = fs.statSync(itemPath);
                        const isLastItem = i === items.length - 1;
                        const connector = isLastItem ? '└── ' : '├── ';
                        const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
                        
                        if (stat.isDirectory()) {
                            treeString += `${prefix}${connector}📁 ${item}/\n`;
                            treeString += generateTree(itemPath, newPrefix, isLastItem);
                        } else {
                            const size = (stat.size / 1024).toFixed(1);
                            treeString += `${prefix}${connector}📄 ${item} (${size} KB)\n`;
                        }
                    }
                    
                    return treeString;
                };
                
                const scanDirectory = (dir, folderName = '') => {
                    if (!fs.existsSync(dir)) return { files: 0, size: 0 };
                    
                    const items = fs.readdirSync(dir);
                    let folderFiles = 0;
                    let folderSize = 0;
                    
                    for (const item of items) {
                        const itemPath = path.join(dir, item);
                        const stat = fs.statSync(itemPath);
                        
                        if (stat.isDirectory()) {
                            if (!excludeDirs.includes(item) && !item.startsWith('.')) {
                                structure.totalFolders++;
                                const subResult = scanDirectory(itemPath, path.join(folderName, item));
                                folderFiles += subResult.files;
                                folderSize += subResult.size;
                            }
                        } else {
                            const ext = path.extname(item).toLowerCase() || 'no extension';
                            const shouldExclude = excludeFiles.some(pattern => {
                                if (pattern.includes('*')) {
                                    const regex = new RegExp(pattern.replace('*', '.*'));
                                    return regex.test(item);
                                }
                                return item === pattern;
                            });
                            
                            if (!shouldExclude) {
                                structure.totalFiles++;
                                structure.totalSize += stat.size;
                                folderFiles++;
                                folderSize += stat.size;
                                
                                structure.byExtension[ext] = (structure.byExtension[ext] || 0) + 1;
                                
                                structure.files.push({
                                    name: item,
                                    path: path.join(folderName, item),
                                    size: stat.size,
                                    ext: ext,
                                    modified: stat.mtime
                                });
                            }
                        }
                    }
                    
                    if (folderName && (folderFiles > 0 || folderSize > 0)) {
                        structure.byFolder[folderName] = {
                            files: folderFiles,
                            size: folderSize
                        };
                    }
                    
                    return { files: folderFiles, size: folderSize };
                };
                
                scanDirectory(rootDir);
                
                if (option === 'tree' || text.trim() === 'tree') {
                    const treeOutput = generateTree(rootDir);
                    await sock.sendMessage(from, { delete: processingMsg.key });
                    
                    const treeHeader = await t(from, 'structure', 'treeHeader');
                    const poweredMsg = await t(from, 'structure', 'powered');
                    
                    let resultText = `${treeHeader}\n\n`;
                    resultText += `📁 ${path.basename(rootDir)}/\n`;
                    resultText += treeOutput || 'No files found\n';
                    resultText += `\n${poweredMsg} ${botName}`;
                    
                    if (resultText.length > 3500) {
                        const parts = resultText.match(/[\s\S]{1,3500}/g) || [];
                        const continuedMsg = await t(from, 'structure', 'continued');
                        for (let i = 0; i < parts.length; i++) {
                            await sock.sendMessage(from, { text: parts[i] + (i < parts.length - 1 ? `\n\n${continuedMsg}` : '') }, { quoted: msg });
                        }
                    } else {
                        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
                    }
                    return;
                }
                
                if (option === 'details') {
                    const sortedBySize = [...structure.files].sort((a, b) => b.size - a.size).slice(0, 20);
                    
                    const detailsHeader = await t(from, 'structure', 'detailsHeader');
                    const totalFilesLabel = await t(from, 'structure', 'totalFiles');
                    const totalFoldersLabel = await t(from, 'structure', 'totalFolders');
                    const totalSizeLabel = await t(from, 'structure', 'totalSize');
                    const largestFilesLabel = await t(from, 'structure', 'largestFiles');
                    const poweredMsg = await t(from, 'structure', 'powered');
                    
                    let resultText = `${detailsHeader}\n\n`;
                    resultText += `${totalFilesLabel} ${structure.totalFiles}\n`;
                    resultText += `${totalFoldersLabel} ${structure.totalFolders}\n`;
                    resultText += `${totalSizeLabel} ${(structure.totalSize / 1024 / 1024).toFixed(2)} MB\n\n`;
                    resultText += `${largestFilesLabel}\n`;
                    
                    for (let i = 0; i < sortedBySize.length; i++) {
                        const file = sortedBySize[i];
                        const sizeKB = (file.size / 1024).toFixed(1);
                        resultText += `${i + 1}. ${file.path}\n`;
                        resultText += `   💾 ${sizeKB} KB | 📝 ${file.ext}\n`;
                        resultText += `   🕒 ${file.modified.toLocaleDateString()}\n\n`;
                    }
                    
                    resultText += `${poweredMsg} ${botName}`;
                    
                    await sock.sendMessage(from, { delete: processingMsg.key });
                    
                    if (resultText.length > 3500) {
                        const parts = resultText.match(/[\s\S]{1,3500}/g) || [];
                        const continuedMsg = await t(from, 'structure', 'continued');
                        for (let i = 0; i < parts.length; i++) {
                            await sock.sendMessage(from, { text: parts[i] + (i < parts.length - 1 ? `\n\n${continuedMsg}` : '') }, { quoted: msg });
                        }
                    } else {
                        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
                    }
                    return;
                }
                
                if (option === 'size') {
                    const sortedFolders = Object.entries(structure.byFolder)
                        .sort((a, b) => b[1].size - a[1].size)
                        .slice(0, 20);
                    
                    const sizeHeader = await t(from, 'structure', 'sizeHeader');
                    const totalSizeLabel = await t(from, 'structure', 'totalSize');
                    const totalFilesLabel = await t(from, 'structure', 'totalFiles');
                    const largestFoldersLabel = await t(from, 'structure', 'largestFolders');
                    const poweredMsg = await t(from, 'structure', 'powered');
                    
                    let resultText = `${sizeHeader}\n\n`;
                    resultText += `${totalSizeLabel} ${(structure.totalSize / 1024 / 1024).toFixed(2)} MB\n`;
                    resultText += `${totalFilesLabel} ${structure.totalFiles}\n\n`;
                    resultText += `${largestFoldersLabel}\n`;
                    
                    for (let i = 0; i < sortedFolders.length; i++) {
                        const [folder, data] = sortedFolders[i];
                        const sizeMB = (data.size / 1024 / 1024).toFixed(2);
                        const percent = ((data.size / structure.totalSize) * 100).toFixed(1);
                        resultText += `${i + 1}. 📁 ${folder || 'root'}\n`;
                        resultText += `   💾 ${sizeMB} MB (${percent}%)\n`;
                        resultText += `   📄 ${data.files} files\n\n`;
                    }
                    
                    resultText += `${poweredMsg} ${botName}`;
                    
                    await sock.sendMessage(from, { delete: processingMsg.key });
                    await sock.sendMessage(from, { text: resultText }, { quoted: msg });
                    return;
                }
                
                if (option === 'files') {
                    const extensions = Object.entries(structure.byExtension).sort((a, b) => b[1] - a[1]);
                    
                    const filesHeader = await t(from, 'structure', 'filesHeader');
                    const totalFilesLabel = await t(from, 'structure', 'totalFiles');
                    const totalSizeLabel = await t(from, 'structure', 'totalSize');
                    const poweredMsg = await t(from, 'structure', 'powered');
                    
                    let resultText = `${filesHeader}\n\n`;
                    
                    for (const [ext, count] of extensions) {
                        const percent = ((count / structure.totalFiles) * 100).toFixed(1);
                        resultText += `📝 ${ext || 'no extension'}: ${count} files (${percent}%)\n`;
                    }
                    
                    resultText += `\n${totalFilesLabel} ${structure.totalFiles} files\n`;
                    resultText += `${totalSizeLabel} ${(structure.totalSize / 1024 / 1024).toFixed(2)} MB\n`;
                    resultText += `\n${poweredMsg} ${botName}`;
                    
                    await sock.sendMessage(from, { delete: processingMsg.key });
                    await sock.sendMessage(from, { text: resultText }, { quoted: msg });
                    return;
                }
                
                const extensions = Object.entries(structure.byExtension).sort((a, b) => b[1] - a[1]).slice(0, 10);
                const largestFiles = [...structure.files].sort((a, b) => b.size - a.size).slice(0, 10);
                
                const analysisHeader = await t(from, 'structure', 'analysisHeader');
                const totalFoldersLabel = await t(from, 'structure', 'totalFolders');
                const totalFilesLabel = await t(from, 'structure', 'totalFiles');
                const totalSizeLabel = await t(from, 'structure', 'totalSize');
                const platformLabel = await t(from, 'structure', 'platform');
                const nodeLabel = await t(from, 'structure', 'node');
                const topExtensionsLabel = await t(from, 'structure', 'topExtensions');
                const largestFilesLabel = await t(from, 'structure', 'largestFiles');
                const tipsLabel = await t(from, 'structure', 'tips');
                const cmdDefault = await t(from, 'structure', 'cmdDefault');
                const cmdTree = await t(from, 'structure', 'cmdTree');
                const cmdDetails = await t(from, 'structure', 'cmdDetails');
                const cmdSize = await t(from, 'structure', 'cmdSize');
                const cmdFiles = await t(from, 'structure', 'cmdFiles');
                const cmdTreeAlias = await t(from, 'structure', 'cmdTreeAlias');
                const poweredMsg = await t(from, 'structure', 'powered');
                
                let resultText = `${analysisHeader}\n\n`;
                resultText += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
                resultText += `│ ${totalFoldersLabel} ${structure.totalFolders}\n`;
                resultText += `│ ${totalFilesLabel} ${structure.totalFiles}\n`;
                resultText += `│ ${totalSizeLabel} ${(structure.totalSize / 1024 / 1024).toFixed(2)} MB\n`;
                resultText += `│ ${platformLabel} ${os.platform()}\n`;
                resultText += `│ ${nodeLabel} ${process.version}\n`;
                resultText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
                
                resultText += `${topExtensionsLabel}\n`;
                for (const [ext, count] of extensions) {
                    resultText += `   ${ext || 'no ext'}: ${count} files\n`;
                }
                resultText += `\n`;
                
                resultText += `${largestFilesLabel}\n`;
                for (let i = 0; i < largestFiles.length; i++) {
                    const file = largestFiles[i];
                    const sizeKB = (file.size / 1024).toFixed(1);
                    resultText += `   ${i + 1}. ${file.path} (${sizeKB} KB)\n`;
                }
                resultText += `\n`;
                
                resultText += `${tipsLabel}\n`;
                resultText += `   • ${cmdDefault}\n`;
                resultText += `   • ${cmdTree}\n`;
                resultText += `   • ${cmdDetails}\n`;
                resultText += `   • ${cmdSize}\n`;
                resultText += `   • ${cmdFiles}\n`;
                resultText += `   • ${cmdTreeAlias}\n`;
                resultText += `\n${poweredMsg} ${botName}`;
                
                await sock.sendMessage(from, { delete: processingMsg.key });
                await sock.sendMessage(from, { text: resultText }, { quoted: msg });
                
            } catch (error) {
                console.error('Structure error:', error);
                await sock.sendMessage(from, { delete: processingMsg.key });
                const errorMsg = await t(from, 'structure', 'error');
                const poweredMsg = await t(from, 'structure', 'powered');
                await sock.sendMessage(from, { 
                    text: `${errorMsg}\n\n${poweredMsg} ${botName}`
                }, { quoted: msg });
            }
        }
    }
];
