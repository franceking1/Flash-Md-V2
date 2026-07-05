import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';
import { Jimp } from 'jimp';
import { MESSAGES } from '../france/index.js';

const S_WHATSAPP_NET = 's.whatsapp.net';

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

const processGroupImage = async (buffer) => {
  const image = await Jimp.read(buffer);
  const resized = image.crop({ x: 0, y: 0, w: image.bitmap.width, h: image.bitmap.height }).scaleToFit({ w: 720, h: 720 });
  return await resized.getBuffer('image/jpeg');
};

export const commands = [
  {
    name: "fullgpp",
    description: "Set group profile picture without cropping or compression.",
    category: "Group",
    aliases: ["fullgp", "gpp"],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedImage = quoted?.imageMessage;
      
      if (!quotedImage) {
        return sock.sendMessage(from, {
          text: MESSAGES.gpp.noImage
        }, { quoted: msg });
      }
      
      try {
        console.log("=== FULLGPP DEBUG START ===");
        console.log("1. Got quoted image message");
        
        const buffer = await getBuffer(quotedImage, "image");
        console.log("2. Buffer created, size:", buffer.length, "bytes");
        
        const mediaPath = path.join(process.cwd(), "temp", `${Date.now()}.jpg`);
        await fs.ensureDir(path.dirname(mediaPath));
        await fs.writeFile(mediaPath, buffer);
        console.log("3. File saved to:", mediaPath);
        
        const image = await Jimp.read(mediaPath);
        const resized = image.crop({ x: 0, y: 0, w: image.bitmap.width, h: image.bitmap.height }).scaleToFit({ w: 720, h: 720 });
        const imgBuffer = await resized.getBuffer('image/jpeg');
        console.log("4. Image resized, output size:", imgBuffer.length, "bytes");
        
        console.log("5. About to send query to update group picture for:", from);
        
        const result = await sock.query({
          tag: "iq",
          attrs: {
            to: from,
            type: "set",
            xmlns: "w:profile:picture"
          },
          content: [{
            tag: "picture",
            attrs: { type: "image" },
            content: imgBuffer
          }]
        });
        
        console.log("6. Query successful, response:", result);
        
        await sock.sendMessage(from, {
          text: MESSAGES.gpp.success
        }, { quoted: msg });
        
        await fs.unlink(mediaPath);
        console.log("=== FULLGPP DEBUG END (SUCCESS) ===");
      } catch (err) {
        console.error("=== FULLGPP ERROR ===");
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        
        await sock.sendMessage(from, {
          text: MESSAGES.gpp.error
        }, { quoted: msg });
      }
    }
  }
];
