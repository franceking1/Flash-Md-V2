import { downloadContentFromMessage, generateWAMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import crypto from 'crypto';

export const commands = [
  {
    name: 'status',
    aliases: ['setstatus', 'mentionstatus', 'togstatus'],
    description: 'Send media/text to group status (lasts 24h).',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        return sock.sendMessage(from, { text: 'This command can only be used in groups.' }, { quoted: msg });
      }
      
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      const quotedMsg = quoted?.quotedMessage;
      
      if (!quotedMsg && !text) {
        return sock.sendMessage(from, { 
          text: '❌ *Please reply to a message or provide text!*\n\nReply to image/video/audio/text with .status'
        }, { quoted: msg });
      }
      
      try {
        let payload = null;
        let mediaType = 'Text';
        
        if (quotedMsg) {
          payload = await buildPayload(quotedMsg);
          mediaType = getMediaType(quotedMsg);
          
          if (text && payload && (payload.image || payload.video)) {
            payload.caption = text;
          }
        } else if (text) {
          payload = { text: text };
          mediaType = 'Text';
        }
        
        if (!payload) {
          return sock.sendMessage(from, { 
            text: '❌ Failed to process message' 
          }, { quoted: msg });
        }
        
        await sendGroupStatus(sock, from, payload);
        
        await sock.sendMessage(from, { 
          text: `✅ ${mediaType} sent to group status!${payload.caption ? `\n📝 "${payload.caption}"` : ''}` 
        }, { quoted: msg });
        
      } catch (error) {
        console.error('[STATUS ERROR]', error);
        await sock.sendMessage(from, { 
          text: `❌ Error: ${error.message}` 
        }, { quoted: msg });
      }
    }
  }
];

async function buildPayload(quotedMsg) {
  const msg = quotedMsg;
  
  if (msg.imageMessage) {
    const buffer = await downloadMedia(msg.imageMessage, 'image');
    return {
      image: buffer,
      caption: msg.imageMessage.caption || '',
      mimetype: msg.imageMessage.mimetype || 'image/jpeg'
    };
  }
  
  if (msg.videoMessage) {
    const buffer = await downloadMedia(msg.videoMessage, 'video');
    return {
      video: buffer,
      caption: msg.videoMessage.caption || '',
      gifPlayback: msg.videoMessage.gifPlayback || false,
      mimetype: msg.videoMessage.mimetype || 'video/mp4'
    };
  }
  
  if (msg.stickerMessage) {
    const buffer = await downloadMedia(msg.stickerMessage, 'sticker');
    return {
      image: buffer,
      caption: '',
      mimetype: 'image/webp'
    };
  }
  
  if (msg.audioMessage) {
    const buffer = await downloadMedia(msg.audioMessage, 'audio');
    return {
      audio: buffer,
      mimetype: msg.audioMessage.mimetype || 'audio/mpeg',
      ptt: msg.audioMessage.ptt || false
    };
  }
  
  if (msg.conversation || msg.extendedTextMessage?.text) {
    return {
      text: msg.conversation || msg.extendedTextMessage.text
    };
  }
  
  return null;
}

async function downloadMedia(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
}

function getMediaType(quotedMsg) {
  const msg = quotedMsg;
  if (msg.imageMessage) return 'Image';
  if (msg.videoMessage) return 'Video';
  if (msg.stickerMessage) return 'Sticker';
  if (msg.audioMessage) return 'Audio';
  return 'Text';
}

async function sendGroupStatus(sock, jid, content) {
  const inside = await generateWAMessageContent(content, {
    upload: sock.waUploadToServer
  });
  
  const messageSecret = crypto.randomBytes(32);
  
  const message = generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: { messageSecret }
      }
    }
  }, {});
  
  await sock.relayMessage(jid, message.message, {
    messageId: message.key.id
  });
  
  return message;
}
