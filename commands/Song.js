import yts from 'yt-search';
import axios from 'axios';
import { API_CONFIG } from '../france/index.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

let ffmpegPath = null;

if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
  ffmpegPath = ffmpegStatic;
  try {
    execSync(`${ffmpegPath} -version`);
  } catch {
    ffmpegPath = null;
  }
}

if (!ffmpegPath) {
  try {
    execSync('ffmpeg -version');
    ffmpegPath = 'ffmpeg';
  } catch {
    try {
      execSync('/usr/bin/ffmpeg -version');
      ffmpegPath = '/usr/bin/ffmpeg';
    } catch {
      try {
        execSync('/usr/local/bin/ffmpeg -version');
        ffmpegPath = '/usr/local/bin/ffmpeg';
      } catch {
        ffmpegPath = null;
      }
    }
  }
}

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

export const commands = [
  {
    name: 'song',
    description: 'Search and download MP3 audio from YouTube (document only).',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';

      if (!text) {
        const noQueryMsg = await t(from, 'song', 'noQuery');
        return sock.sendMessage(from, { text: `${noQueryMsg}\n\n⚡ Powered by ${botName} ${botVersion}` });
      }

      try {
        if (!API_CONFIG?.nayanApi?.youtube) {
          throw new Error('Nayan API not configured');
        }

        const searchingMsg = await t(from, 'song', 'searching');
        await sock.sendMessage(from, { text: searchingMsg }, { quoted: msg });

        const search = await yts(text);
        const video = search.videos?.[0];

        if (!video) {
          const notFoundMsg = await t(from, 'song', 'notFound');
          return sock.sendMessage(from, { text: `${notFoundMsg}\n\n⚡ Powered by ${botName} ${botVersion}` });
        }

        const videoUrl = `https://youtu.be/${video.videoId}`;
        const apiUrl = `${API_CONFIG.nayanApi.youtube}?url=${encodeURIComponent(videoUrl)}`;

        const downloadingMsg = await t(from, 'song', 'downloading');
        await sock.sendMessage(from, { text: downloadingMsg }, { quoted: msg });

        const response = await axios.get(apiUrl, {
          timeout: API_CONFIG.nayanApi.timeout || 30000
        });

        if (!response.data?.status || !response.data?.data?.audio) {
          const failedMsg = await t(from, 'song', 'failed');
          return sock.sendMessage(from, { text: `${failedMsg}\n\n⚡ Powered by ${botName} ${botVersion}` });
        }

        const downloadLink = response.data.data.audio;
        const videoInfo = response.data.data;

        const safeTitle = (video.title || 'audio').replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp3`;

        const titleLabel = await t(from, 'song', 'title');
        const durationLabel = await t(from, 'song', 'duration');
        const channelLabel = await t(from, 'song', 'channel');
        const poweredLabel = await t(from, 'song', 'powered');

        await sock.sendMessage(from, {
          image: { url: video.thumbnail || videoInfo.thumb },
          caption:
            `*🎵 ${botName.toUpperCase()} SONG*\n\n` +
            `${titleLabel} ${videoInfo.title || video.title}\n` +
            `${durationLabel} ${video.timestamp || 'N/A'}\n` +
            `${channelLabel} ${videoInfo.channel || video.author?.name}\n` +
            `${poweredLabel} ${botName}`
        }, { quoted: msg });

        const audioRes = await axios.get(downloadLink, {
          responseType: 'arraybuffer',
          timeout: 30000
        });

        const audioBuffer = audioRes.data;

        const tempDir = process.env.TEMP_DIR || './temp';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const inputPath = path.join(tempDir, `${Date.now()}.m4a`);
        const outputPath = path.join(tempDir, `${Date.now()}.mp3`);

        fs.writeFileSync(inputPath, audioBuffer);

        if (!ffmpegPath) {
          await sock.sendMessage(from, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName
          }, { quoted: msg });
          return;
        }

        const conversionPromise = new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .audioBitrate(128)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('FFmpeg timeout')), 30000)
        );

        try {
          await Promise.race([conversionPromise, timeoutPromise]);

          const finalBuffer = fs.readFileSync(outputPath);

          await sock.sendMessage(from, {
            document: finalBuffer,
            mimetype: 'audio/mpeg',
            fileName
          }, { quoted: msg });

          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

          await sock.sendMessage(from, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName
          }, { quoted: msg });
        }

      } catch (err) {
        console.error(err);
        const errorMsg = await t(from, 'song', 'error');
        sock.sendMessage(from, {
          text: `${errorMsg} ${err.message || 'Unknown error'}`
        });
      }
    }
  }
];
