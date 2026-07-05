import os from 'os';
import moment from 'moment-timezone';
import { detectPlatform, formatUptime, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const botStartTime = Date.now();

export const commands = [
  {
    name: 'host',
    aliases: ['platform'],
    description: 'Shows details about the current hosting environment.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      const platform = detectPlatform();
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const uptimeBot = formatUptime((Date.now() - botStartTime) / 1000);
      const time = moment().tz('Africa/Nairobi').format('HH:mm:ss | DD/MM/YYYY');
      
      const hostInfoTemplate = await t(from, 'host', 'info');
      const hostInfo = hostInfoTemplate
        .replace('{platform}', platform)
        .replace('{time}', time)
        .replace('{uptime}', uptimeBot)
        .replace('{usedMem}', usedMem)
        .replace('{totalMem}', totalMem);
      
      try {
        await sock.sendMessage(from, {
          text: hostInfo,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363238139244263@newsletter',
              newsletterName: 'FLASH-MD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });
      } catch (error) {
        console.error('Error in host command:', error);
        const errorMsg = await t(from, 'host', 'error');
        await sock.sendMessage(from, {
          text: errorMsg.replace('{error}', error.response?.status || error.message)
        }, { quoted: msg });
      }
    }
  }
];
