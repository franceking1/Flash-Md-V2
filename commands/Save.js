import { downloadMediaMessage } from '@whiskeysockets/baileys';
import CONFIG from '../config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getOwnerJid() {
  if (!CONFIG.OWNER_NUMBER) return null
  let ownerNumber = CONFIG.OWNER_NUMBER.toString()
  ownerNumber = ownerNumber.replace(/[+\s]/g, '')
  ownerNumber = ownerNumber.replace(/[^0-9]/g, '')
  return `${ownerNumber}@s.whatsapp.net`
}

export const commands = [
  {
    name: 'save',
    description: 'Save and forward a replied message to bot owner.',
    category: 'WhatsApp',
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quoted) {
        const noReplyMsg = await t(from, 'save', 'noReply');
        return sock.sendMessage(from, { text: noReplyMsg }, { quoted: msg });
      }
      
      const BOT_OWNER_ID = getOwnerJid();
      
      if (!BOT_OWNER_ID) {
        const noOwnerMsg = await t(from, 'save', 'noOwner');
        return sock.sendMessage(from, { text: noOwnerMsg }, { quoted: msg });
      }
      
      try {
        const quotedMsg = { message: quoted };
        
        if (quoted.imageMessage) {
          const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console });
          const imageCaption = await t(from, 'save', 'image');
          await sock.sendMessage(BOT_OWNER_ID, { 
            image: buffer, 
            caption: quoted.imageMessage?.caption || imageCaption
          });
        } 
        else if (quoted.videoMessage) {
          const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console });
          const videoCaption = await t(from, 'save', 'video');
          await sock.sendMessage(BOT_OWNER_ID, { 
            video: buffer, 
            caption: quoted.videoMessage?.caption || videoCaption
          });
        } 
        else if (quoted.audioMessage) {
          const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console });
          await sock.sendMessage(BOT_OWNER_ID, { 
            audio: buffer, 
            mimetype: 'audio/mp4',
            ptt: quoted.audioMessage?.ptt || false
          });
        } 
        else if (quoted.stickerMessage) {
          const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console });
          await sock.sendMessage(BOT_OWNER_ID, { sticker: buffer });
        } 
        else if (quoted.documentMessage) {
          const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console });
          await sock.sendMessage(BOT_OWNER_ID, { 
            document: buffer, 
            mimetype: quoted.documentMessage?.mimetype,
            fileName: quoted.documentMessage?.fileName || 'document'
          });
        }
        else if (quoted?.conversation || quoted?.extendedTextMessage) {
          const textContent = quoted.conversation || quoted.extendedTextMessage?.text || 'No text content';
          await sock.sendMessage(BOT_OWNER_ID, { text: textContent });
        } 
        else {
          const unsupportedMsg = await t(from, 'save', 'unsupported');
          return sock.sendMessage(from, { text: unsupportedMsg }, { quoted: msg });
        }
        
        const successMsg = await t(from, 'save', 'success');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
        
      } catch (err) {
        console.error('Save command error:', err);
        const errorMsg = await t(from, 'save', 'error');
        await sock.sendMessage(from, { text: `${errorMsg} ${err.message}` }, { quoted: msg });
      }
    }
  }
];
