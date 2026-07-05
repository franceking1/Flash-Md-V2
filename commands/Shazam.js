import acrcloud from 'acrcloud';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { MESSAGES, API_CONFIG } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const TEMP_DIR = path.join(process.cwd(), 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function identifySong(buffer) {
  const acr = new acrcloud({
    host: API_CONFIG.acrcloud.host,
    access_key: API_CONFIG.acrcloud.access_key,
    access_secret: API_CONFIG.acrcloud.access_secret
  });
  const result = await acr.identify(buffer);
  if (result.status.code !== 0 || !result.metadata?.music?.length) return null;
  return result.metadata.music[0];
}

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export const commands = [
  {
    name: 'shazam',
    aliases: ['whatsong', 'findsong', 'identify'],
    description: 'Identify a song from an audio or video clip.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'FLASH-MD';
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quoted || (!quoted.audioMessage && !quoted.videoMessage)) {
        const noReplyMsg = await t(from, 'shazam', 'noReply');
        return sock.sendMessage(from, {
          text: noReplyMsg
        }, { quoted: msg });
      }
      
      try {
        let buffer;
        if (quoted.audioMessage) {
          buffer = await getBuffer(quoted.audioMessage, 'audio');
        } else {
          buffer = await getBuffer(quoted.videoMessage, 'video');
        }
        
        const MAX_SIZE = 1 * 1024 * 1024;
        if (buffer.length > MAX_SIZE) buffer = buffer.slice(0, MAX_SIZE);
        
        const matchedSong = await identifySong(buffer);
        
        if (!matchedSong) {
          const notRecognizedMsg = await t(from, 'shazam', 'notRecognized');
          return sock.sendMessage(from, {
            text: notRecognizedMsg
          }, { quoted: msg });
        }
        
        const { title, artists, album, genres, release_date } = matchedSong;
        const ytQuery = `${title} ${artists?.[0]?.name || ''}`;
        const ytSearch = await yts(ytQuery);
        
        const headerMsg = await t(from, 'shazam', 'header');
        const titleMsg = await t(from, 'shazam', 'title');
        const artistsMsg = await t(from, 'shazam', 'artists');
        const albumMsg = await t(from, 'shazam', 'album');
        const genresMsg = await t(from, 'shazam', 'genres');
        const releaseMsg = await t(from, 'shazam', 'release');
        const youtubeMsg = await t(from, 'shazam', 'youtube');
        const footerMsg = await t(from, 'shazam', 'footer');
        
        let response = headerMsg;
        response += titleMsg.replace('{title}', title || 'Unknown');
        
        if (artists) {
          response += artistsMsg.replace('{artists}', artists.map(a => a.name).join(', '));
        }
        if (album?.name) {
          response += albumMsg.replace('{album}', album.name);
        }
        if (genres?.length) {
          response += genresMsg.replace('{genres}', genres.map(g => g.name).join(', '));
        }
        if (release_date) {
          const [year, month, day] = release_date.split('-');
          response += releaseMsg
            .replace('{day}', day)
            .replace('{month}', month)
            .replace('{year}', year);
        }
        if (ytSearch?.videos?.[0]?.url) {
          response += youtubeMsg.replace('{url}', ytSearch.videos[0].url);
        }
        
        response += footerMsg.replace('{botName}', botName);
        
        return sock.sendMessage(from, {
          text: response.trim(),
          contextInfo: {
            forwardingScore: 777,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363238139244263@newsletter',
              newsletterName: botName,
              serverMessageId: -1
            }
          }
        }, { quoted: msg });
      } catch (err) {
        console.error('Shazam error:', err);
        const errorMsg = await t(from, 'shazam', 'error');
        return sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
