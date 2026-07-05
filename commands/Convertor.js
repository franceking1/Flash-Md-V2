import { 
  downloadMedia,
  delay,
  MESSAGES,
  LIMITS
} from '../france/index.js';

import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { tmpdir } from 'os';
import { Sticker } from 'wa-sticker-formatter';
import ffmpegStatic from 'ffmpeg-static';
import fluentFfmpeg from 'fluent-ffmpeg';
import axios from 'axios';

const execPromise = util.promisify(exec);
const ffmpeg = fluentFfmpeg;
ffmpeg.setFfmpegPath(ffmpegStatic);

export const commands = [
  {
    name: 'trim',
    description: 'Trim quoted audio or video.',
    category: 'Converter',
    execute: async ({ sock, from, text, msg }) => {
      const args = text ? text.split(' ') : [];
      const start = parseInt(args[0]);
      const end = parseInt(args[1]);

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isVideo = quoted?.videoMessage;
      const isAudio = quoted?.audioMessage;

      if (!(isVideo || isAudio)) {
        return sock.sendMessage(from, {
          text: MESSAGES.trim.error
        });
      }

      if (isNaN(start) || isNaN(end) || end <= start) {
        return sock.sendMessage(from, {
          text: MESSAGES.trim.invalid
        });
      }

      try {
        const buffer = await downloadMediaMessage(
          { message: quoted },
          'buffer',
          {},
          { logger: console }
        );

        const ext = isVideo ? 'mp4' : 'mp3';
        const input = path.join(tmpdir(), `input_${Date.now()}.${ext}`);
        const output = path.join(tmpdir(), `output_${Date.now()}.${ext}`);
        fs.writeFileSync(input, buffer);

        ffmpeg(input)
          .setStartTime(start)
          .setDuration(end - start)
          .output(output)
          .on('end', async () => {
            const trimmed = fs.readFileSync(output);
            await sock.sendMessage(from, {
              [isVideo ? 'video' : 'audio']: trimmed,
              mimetype: isVideo ? 'video/mp4' : 'audio/mp4',
              ptt: !isVideo
            });
            fs.unlinkSync(input);
            fs.unlinkSync(output);
          })
          .on('error', async () => {
            await sock.sendMessage(from, {
              text: MESSAGES.trim.failed
            });
            if (fs.existsSync(input)) fs.unlinkSync(input);
            if (fs.existsSync(output)) fs.unlinkSync(output);
          })
          .run();
      } catch (error) {
        await sock.sendMessage(from, {
          text: MESSAGES.trim.downloadError
        });
      }
    }
  },
{
  name: 'quotly',
  aliases: ['quote', 'q'],
  description: 'Create a quote sticker with text and username',
  category: 'General',
  execute: async ({ sock, from, text, msg }) => {
    if (!text) {
      return sock.sendMessage(from, {
        text: '❌ *Please provide text and username.*\n\nExample: `.quotly am the best by France King`'
      });
    }

    try {
      const byIndex = text.toLowerCase().indexOf(' by ');
      
      if (byIndex === -1) {
        return sock.sendMessage(from, {
          text: '❌ *Invalid format.*\n\nUse: `.quotly your message by username`\nExample: `.quotly am the best by France King`'
        });
      }

      const message = text.substring(0, byIndex).trim();
      const username = text.substring(byIndex + 4).trim();

      if (!message || !username) {
        return sock.sendMessage(from, {
          text: '❌ *Both message and username are required.*'
        });
      }

      await sock.sendMessage(from, {
        text: '🖼️ *Generating quote sticker...* Please wait.'
      });

      const pfpUrl = 'https://telegra.ph/file/e991bb4b535a0f1425aa0.jpg';
      const apiUrl = `https://weeb-api.vercel.app/quotly?pfp=${encodeURIComponent(pfpUrl)}&username=${encodeURIComponent(username)}&text=${encodeURIComponent(message)}`;
      
      const response = await axios.get(apiUrl, { 
        responseType: 'arraybuffer',
        timeout: 15000
      });
      
      if (response.status !== 200 || response.data.length < 1000) {
        return sock.sendMessage(from, {
          text: '❌ *API returned invalid image.* Please try again.'
        });
      }
      
      const imageBuffer = Buffer.from(response.data);
      
      const { Sticker, StickerTypes } = await import('wa-sticker-formatter');
      
      const sticker = new Sticker(imageBuffer, {
        pack: 'FLASH-MD-V3',
        author: username,
        type: StickerTypes.FULL,
        quality: 100
      });
      
      const stickerBuffer = await sticker.toBuffer();
      
      await sock.sendMessage(from, {
        sticker: stickerBuffer
      });

    } catch (error) {
      console.error('Quotly error:', error.message);
      await sock.sendMessage(from, {
        text: '❌ *Failed to generate quote sticker.* Please try again.'
      });
    }
  }
}, 
  {
    name: 'toimg',
    aliases: ['photo'],
    description: 'Convert static sticker to image.',
    category: 'Converter',
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted?.stickerMessage) {
        return sock.sendMessage(from, {
          text: MESSAGES.toimg.noSticker
        });
      }

      if (
        quoted.stickerMessage.isAnimated ||
        quoted.stickerMessage.isLottie ||
        quoted.stickerMessage.mimetype !== 'image/webp'
      ) {
        return sock.sendMessage(from, {
          text: MESSAGES.toimg.unsupported
        });
      }

      const tmpPath = './temp/sticker.webp';
      const outPath = './temp/image.jpg';

      try {
        const buffer = await downloadMediaMessage(
          { message: quoted },
          'buffer',
          {},
          { logger: console }
        );

        fs.ensureDirSync('./temp');
        fs.writeFileSync(tmpPath, buffer);

        await execPromise(`"${ffmpegStatic}" -y -i "${tmpPath}" "${outPath}"`);
        await sock.sendMessage(from, {
          image: fs.readFileSync(outPath),
          caption: MESSAGES.toimg.success
        });
      } catch (err) {
        await sock.sendMessage(from, {
          text: `${MESSAGES.toimg.error}\n\n${err.message}`
        });
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      }
    }
  },
  {
    name: 'sticker',
    aliases: ['s'],
    description: 'Convert image or video to sticker',
    category: 'Converter',
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isQuotedImage = quoted?.imageMessage;
      const isQuotedVideo = quoted?.videoMessage;
      const isDirectImage = msg.message?.imageMessage;
      const isDirectVideo = msg.message?.videoMessage;

      try {
        if (isQuotedImage || isDirectImage) {
          const sourceMsg = isQuotedImage ? { message: quoted } : { message: msg.message };
          const buffer = await downloadMediaMessage(sourceMsg, 'buffer', {}, { logger: console });

          const sticker = new Sticker(buffer, {
            pack: 'FLASH-MD',
            author: msg.pushName || 'User',
            type: text?.includes('crop') ? 'cropped' : 'full',
            quality: 70
          });
          return await sock.sendMessage(from, { sticker: await sticker.toBuffer() });
        } else if (isQuotedVideo || isDirectVideo) {
          const sourceMsg = isQuotedVideo ? { message: quoted } : { message: msg.message };
          const buffer = await downloadMediaMessage(sourceMsg, 'buffer', {}, { logger: console });

          const inputPath = `./video_${Date.now()}.mp4`;
          const outputPath = `./sticker_${Date.now()}.webp`;
          await fs.writeFile(inputPath, buffer);

          try {
            await new Promise((resolve, reject) => {
              ffmpeg(inputPath)
                .setFfmpegPath(ffmpegStatic)
                .outputOptions([
                  "-vcodec", "libwebp",
                  "-vf", "fps=15,scale=512:512:force_original_aspect_ratio=decrease",
                  "-loop", "0",
                  "-preset", "default",
                  "-an",
                  "-vsync", "0"
                ])
                .output(outputPath)
                .on("end", resolve)
                .on("error", reject)
                .run();
            });

            const sticker = new Sticker(await fs.readFile(outputPath), {
              pack: 'FLASH-MD',
              author: msg.pushName || 'User',
              type: 'full',
              quality: 70
            });

            await sock.sendMessage(from, { sticker: await sticker.toBuffer() });
          } catch (err) {
            return await sock.sendMessage(from, { text: `FFmpeg error: ${err.message}` });
          } finally {
            if (await fs.pathExists(inputPath)) await fs.unlink(inputPath);
            if (await fs.pathExists(outputPath)) await fs.unlink(outputPath);
          }
        } else {
          return await sock.sendMessage(from, { text: MESSAGES.sticker.noMedia });
        }
      } catch (err) {
        return await sock.sendMessage(from, { text: MESSAGES.sticker.error.replace('{error}', err.message) });
      }
    }
  },
  {
    name: 'tomp3',
    aliases: ['toaudio', 'audio'],
    description: 'Convert video to audio (mp3)',
    category: 'Converter',
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isQuotedVideo = quoted?.videoMessage;
      const isDirectVideo = msg.message?.videoMessage;

      if (!isQuotedVideo && !isDirectVideo) {
        return await sock.sendMessage(from, { text: MESSAGES.tomp3.noVideo });
      }

      const inputPath = `./video_${Date.now()}.mp4`;
      const outputPath = `./audio_${Date.now()}.mp3`;

      try {
        const sourceMsg = isQuotedVideo ? { message: quoted } : { message: msg.message };
        const buffer = await downloadMediaMessage(sourceMsg, 'buffer', {}, { logger: console });
        await fs.writeFile(inputPath, buffer);

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .setFfmpegPath(ffmpegStatic)
            .output(outputPath)
            .on('end', resolve)
            .on('error', reject)
            .run();
        });

        const audio = await fs.readFile(outputPath);
        await sock.sendMessage(from, { audio, mimetype: 'audio/mpeg' });

      } catch (err) {
        return await sock.sendMessage(from, { text: MESSAGES.tomp3.error.replace('{error}', err.message) });
      } finally {
        if (await fs.pathExists(inputPath)) await fs.unlink(inputPath);
        if (await fs.pathExists(outputPath)) await fs.unlink(outputPath);
      }
    }
  },
  {
    name: 'take',
    description: 'Take sticker with custom pack name',
    category: 'Converter',
    execute: async ({ sock, from, text, msg }) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isQuotedImage = quoted?.imageMessage;
      const isQuotedVideo = quoted?.videoMessage;
      const isQuotedSticker = quoted?.stickerMessage;

      if (!quoted || !(isQuotedImage || isQuotedVideo || isQuotedSticker)) {
        return await sock.sendMessage(from, { text: MESSAGES.take.noMedia });
      }

      let filePath;

      try {
        const buffer = await downloadMediaMessage(
          { message: quoted },
          'buffer',
          {},
          { logger: console }
        );

        filePath = `./temp_${Date.now()}`;
        await fs.writeFile(filePath, buffer);

        const pack = text || msg.pushName || 'Flash-MD';

        const sticker = new Sticker(buffer, {
          pack,
          type: 'full',
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent"
        });

        const stickerBuffer = await sticker.toBuffer();
        await sock.sendMessage(from, { sticker: stickerBuffer });

      } catch (err) {
        return await sock.sendMessage(from, { text: MESSAGES.take.error.replace('{error}', err.message) });
      } finally {
        if (filePath && await fs.pathExists(filePath)) await fs.unlink(filePath);
      }
    }
  }
];
