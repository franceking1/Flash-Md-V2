import now from 'performance-now';
import { LIMITS, MESSAGES } from './config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import util from 'util';
import axios from 'axios';

export const NEWSLETTER_JID = '120363238139244263@newsletter';
export const NEWSLETTER_NAME = 'FLASH-MD';

export function normalizeJid(jid) {
  if (!jid) return null;
  if (!jid.includes('@')) return `${jid}@s.whatsapp.net`;
  return jid;
}

export function saveSudoList(sudoSet) {
  const sudoArray = Array.from(sudoSet);
  const sudoFile = path.join(process.cwd(), 'sudo.json');
  fs.writeFileSync(sudoFile, JSON.stringify(sudoArray, null, 2));
}

export function formatPhoneNumber(number) {
  return number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function truncateMessage(message, maxLength = LIMITS.maxMessageLength) {
  return message.length > maxLength ? message.slice(0, maxLength) + '…' : message;
}

export function formatError(err, context = '') {
  const status = err.response?.status;
  const errorData = err.response?.data;
  const message = err.message;
  const stack = err.stack;

  const parts = [
    context ? `*${context}*` : '*❌ Error:*',
    status ? `*Status:* ${status}` : '',
    message ? `*Reason:* ${message}` : '',
    errorData ? `*Data:* ${JSON.stringify(errorData, null, 2)}` : '',
    stack ? `*Trace:* ${stack}` : ''
  ].filter(Boolean);
  
  return truncateMessage(parts.join('\n\n'));
}

export function isValidPhoneNumber(number) {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length >= 10;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function detectPlatform() {
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

  return 'Panel';
}

export function getSenderId(msg) {
  return (msg.key?.participant || msg.key?.remoteJid || '0@s.whatsapp.net').split('@')[0];
}

export function createQuotedContact(senderId) {
  return {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      contactMessage: {
        displayName: 'FLASH-MD-V3',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:FLASH-MD-V3\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  };
}

export function formatUptime(ms) {
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

export function formatJid(input) {
  const cleaned = input.replace(/[^0-9]/g, '');
  return `${cleaned}@s.whatsapp.net`;
}

export function getSenderJid(msg) {
  return msg.key.participant || msg.key.remoteJid;
}

export function protectOwner(jid) {
  const protectedJIDs = [
    '254742063632@s.whatsapp.net',
    '254757835036@s.whatsapp.net'
  ];
  return protectedJIDs.includes(jid);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + (date.getHours() % 12 || 12)).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 60);
  
  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    ms: ms % 1000
  };
}

export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getUserNumber(jid) {
  if (!jid) return null;
  const number = jid.split('@')[0];
  return number.replace(/\D/g, '');
}

export async function downloadMedia(message, sock) {
  const buffer = await downloadMediaMessage(
    message,
    'buffer',
    {},
    { logger: console }
  );
  return buffer;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function randomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

export function getRandomDevice() {
  const devices = [
    'Samsung Galaxy A52', 'Tecno Spark 10', 'Infinix Hot 30',
    'Huawei Y9 Prime', 'iTel S23+', 'Xiaomi Redmi Note 11',
    'Nokia G21', 'Oppo A58', 'Realme C35', 'Vivo Y33s',
    'OnePlus Nord N20', 'HTC U20', 'Motorola G Stylus', 'Sony Xperia 10'
  ];
  return devices[Math.floor(Math.random() * devices.length)];
}

export function getFakeFiles() {
  const files = ['passwords.txt', 'bank_logins.csv', 'nudes.zip', 'crypto_keys.txt', 'facebook_tokens.json'];
  return files[Math.floor(Math.random() * files.length)];
}

export const progressSteps = [
  `[▓░░░░░░░░░] 10%`,
  `[▓▓░░░░░░░░] 20%`,
  `[▓▓▓░░░░░░░] 30%`,
  `[▓▓▓▓░░░░░░] 40%`,
  `[▓▓▓▓▓░░░░░] 50%`,
  `[▓▓▓▓▓▓░░░░] 60%`,
  `[▓▓▓▓▓▓▓░░░] 70%`,
  `[▓▓▓▓▓▓▓▓░░] 80%`,
  `[▓▓▓▓▓▓▓▓▓░] 90%`,
  `[▓▓▓▓▓▓▓▓▓▓] 100%`
];

export const hackMessages = [
  `🔌 Connecting to device: {device}`,
  `🌐 IP Address: {ip}`,
  `📡 Signal strength: ▓▓▓▓▓▓▓▓▓▒ 95%`,
  `🧬 Accessing personal files...`,
  `📂 File found: *{file1}*`,
  `📂 File found: *{file2}*`,
  `🧾 Reading browser history...`,
  `🔍 Found suspicious activity on dark web...`,
  `💸 Linked bank accounts detected...`,
  `🚨 Transferring ₿ crypto assets...`,
  `🧪 Injecting malware into WhatsApp backup...`,
  `💾 Download complete.`,
  `🧹 Deleting traces...`,
  `💀 Hack complete. Target is now under our control.`,
  `🛑 *Warning:* This hack has triggered a report to Interpol. Good luck 😈`
];

export function getLoveEmoji(percentage) {
  if (percentage < 25) return '💔';
  if (percentage < 50) return '🤔';
  if (percentage < 75) return '😊';
  return '💖';
}

export function formatResponse(text, botName, botVersion) {
  return `${text}\n\n⚡ Powered by ${botName} ${botVersion}`;
}

export async function downloadContentFromMessage(message, type) {
  const buffer = await downloadMediaMessage(
    { message },
    'buffer',
    {},
    { logger: console }
  );
  return buffer;
}

export const fetchRepoStats = async () => {
  try {
    const response = await axios.get('https://api.github.com/repos/franceking1/Flash-Md-V3');
    const { forks_count, stargazers_count, watchers_count, created_at, pushed_at } = response.data;
    return {
      forks: forks_count || 0,
      stars: stargazers_count || 0,
      watchers: watchers_count || 0,
      created: new Date(created_at).toLocaleDateString('en-GB'),
      lastUpdated: new Date(pushed_at).toLocaleDateString('en-GB')
    };
  } catch {
    return { forks: 0, stars: 0, watchers: 0, created: 'N/A', lastUpdated: 'N/A' };
  }
};

export async function processGroupImage(buffer) {
  const Jimp = await import('jimp');
  const image = await Jimp.default.read(buffer);
  const resized = image.scaleToFit(720, 720);
  const imgBuffer = await resized.getBufferAsync(Jimp.default.MIME_JPEG);
  return imgBuffer;
}
