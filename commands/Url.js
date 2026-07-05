import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import path from 'path';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { t } from '../france/translator.js';

async function uploadToImgBB(filePath) {
  const buffer = await fs.readFile(filePath);
  const form = new FormData();
  form.append('image', buffer.toString('base64'));
  
  const { data } = await axios.post('https://api.imgbb.com/1/upload?key=8b468bac6311f8b2fd23d20e90186ac8', form, {
    headers: form.getHeaders()
  });

  return data.data.url;
}

async function saveMediaToTemp(mediaMessage, type) {
  const tmpDir = path.join(process.cwd(), 'temp');
  await fs.ensureDir(tmpDir);
  
  const fileName = `${type}-${Date.now()}.media`;
  const filePath = path.join(tmpDir, fileName);
  
  let downloadType;
  if (type === 'image') downloadType = 'image';
  else if (type === 'video') downloadType = 'video';
  else if (type === 'audio') downloadType = 'audio';
  else if (type === 'document') downloadType = 'document';
  else if (type === 'sticker') downloadType = 'sticker';
  
  const stream = await downloadContentFromMessage(mediaMessage, downloadType);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  
  await fs.writeFile(filePath, buffer);
  return filePath;
}

function getMediaType(quoted) {
  if (quoted.imageMessage) return { type: "image", msg: quoted.imageMessage };
  if (quoted.videoMessage) return { type: "video", msg: quoted.videoMessage };
  if (quoted.stickerMessage) return { type: "sticker", msg: quoted.stickerMessage };
  if (quoted.audioMessage) return { type: "audio", msg: quoted.audioMessage };
  if (quoted.documentMessage) return { type: "document", msg: quoted.documentMessage };
  return null;
}

export const commands = [
  {
    name: 'url',
    description: 'Upload quoted image to ImgBB',
    category: 'Uploader',
    execute: async ({ sock, from, msg, config }) => {
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quotedMsg) {
        const noMediaMsg = await t(from, 'url', 'noMedia');
        return sock.sendMessage(from, { 
          text: noMediaMsg
        }, { quoted: msg });
      }

      const media = getMediaType(quotedMsg);
      if (!media || media.type !== "image") {
        const noMediaMsg = await t(from, 'url', 'noMedia');
        return sock.sendMessage(from, { 
          text: noMediaMsg
        }, { quoted: msg });
      }

      let filePath;
      try {
        filePath = await saveMediaToTemp(media.msg, media.type);
        
        const stats = await fs.stat(filePath);
        const maxSize = 32 * 1024 * 1024;
        if (stats.size > maxSize) {
          const tooLargeMsg = await t(from, 'url', 'tooLarge');
          return sock.sendMessage(from, { text: tooLargeMsg }, { quoted: msg });
        }
        
        const link = await uploadToImgBB(filePath);
        const successMsg = await t(from, 'url', 'success');
        const poweredMsg = await t(from, 'url', 'powered');
        
        await sock.sendMessage(from, { 
          text: `${successMsg}\n\n🔗 ${link}\n\n${poweredMsg} ${config.BOT_NAME || 'Flash-MD'}`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363238139244263@newsletter',
              newsletterName: config.BOT_NAME || 'Flash-MD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });
        
      } catch (error) {
        console.error('ImgBB upload error:', error);
        const errorMsg = await t(from, 'url', 'error');
        return sock.sendMessage(from, { 
          text: errorMsg
        }, { quoted: msg });
      } finally {
        if (filePath && await fs.pathExists(filePath)) {
          try { await fs.unlink(filePath); } catch(e) {}
        }
      }
    }
  }
];
