const { franceking } = require('../main');
const axios = require('axios');
const yts = require('yt-search');

const BASE_URL = 'https://noobs-api.top';

module.exports = [
  {
    name: 'play',
    get flashOnly() {
  return franceking();
},
    aliases: ['music'],
    description: 'Search and play MP3 music from YouTube (audio only).',
    category: 'Search',
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const query = args.join(' ');

      if (!query) {
        return king.sendMessage(fromJid, {
          text: 'Please provide a song name or keyword.'
        }, { quoted: msg });
      }

      try {
        console.log('[PLAY] Searching YT for:', query);
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
          return king.sendMessage(fromJid, {
            text: 'No results found for your query.'
          }, { quoted: msg });
        }

        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp3`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) {
          return king.sendMessage(fromJid, {
            text: 'Failed to retrieve the MP3 download link.'
          }, { quoted: msg });
        }

        const message = {
          image: { url: video.thumbnail },
          caption:
            IRON-MAN-MD SONG PLAYER*\n\n` +
            `╭───────────────◆\n` +
            `│⿻ *Title:* ${video.title}\n` +
            `│⿻ *Duration:* ${video.timestamp}\n` +
            `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
            `│⿻ *Uploaded:* ${video.ago}\n` +
            `│⿻ *Channel:* ${video.author.name}\n` +
            `╰────────────────◆\n\n` +
            `🔗 ${video.url}`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363347365643318@newsletter',
              newsletterName: 'IRON-MAN-MD',
              serverMessageId: -1
            }
          }
        };

        await king.sendMessage(fromJid, message, { quoted: msg });

        await king.sendMessage(fromJid, {
          audio: { url: data.downloadLink },
          mimetype: 'audio/mpeg',
          fileName
        }, { quoted: msg });

      } catch (err) {
        console.error('[PLAY] Error:', err);
        await king.sendMessage(fromJid, {
          text: 'An error occurred while processing your request.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'song',
    get flashOnly() {
  return franceking();
},
    aliases: ['audiofile', 'mp3doc'],
    description: 'Search and send MP3 music as document from YouTube.',
    category: 'Search',
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const query = args.join(' ');

      if (!query) {
        return king.sendMessage(fromJid, {
          text: 'Please provide a song name or keyword.'
        }, { quoted: msg });
      }

      try {
        console.log('[SONG] Searching YT for:', query);
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
          return king.sendMessage(fromJid, {
            text: 'No results found for your query.'
          }, { quoted: msg });
        }

        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp3`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;

        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) {
          return king.sendMessage(fromJid, {
            text: 'Failed to retrieve the MP3 download link.'
          }, { quoted: msg });
        }

        const message = {
          image: { url: video.thumbnail },
          caption:
            IRON-MAN-MD SONG PLAYER*\n\n` +
            `╭───────────────◆\n` +
            `│⿻ *Title:* ${video.title}\n` +
            `│⿻ *Duration:* ${video.timestamp}\n` +
            `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
            `│⿻ *Uploaded:* ${video.ago}\n` +
            `│⿻ *Channel:* ${video.author.name}\n` +
            `╰────────────────◆\n\n` +
            `🔗 ${video.url}`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363347365643318@newsletter',
              newsletterName: 'IRON-MAN-MD',
              serverMessageId: -1
            }
          }
        };

        await king.sendMessage(fromJid, message, { quoted: msg });

        await king.sendMessage(fromJid, {
          document: { url: data.downloadLink },
          mimetype: 'audio/mpeg',
          fileName
        }, { quoted: msg });

      } catch (err) {
        console.error('[SONG] Error:', err);
        await king.sendMessage(fromJid, {
          text: 'An error occurred while processing your request.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'video',
    get flashOnly() {
  return franceking();
},
    aliases: ['vid', 'mp4', 'movie'],
    description: 'Search and send video from YouTube as MP4.',
    category: 'Search',
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const query = args.join(' ');

      if (!query) {
        return king.sendMessage(fromJid, {
          text: 'Please provide a video name or keyword.'
        }, { quoted: msg });
      }

      try {
        console.log('[VIDEO] Searching YT for:', query);
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
          return king.sendMessage(fromJid, {
            text: 'No results found for your query.'
          }, { quoted: msg });
        }

        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp4`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;

        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) {
          return king.sendMessage(fromJid, {
            text: 'Failed to retrieve the MP4 download link.'
          }, { quoted: msg });
        }

        const message = {
          image: { url: video.thumbnail },
          caption:
            *`IRON-MAN-MD VIDEO PLAYER*\n\n` +
            `╭───────────────◆\n` +
            `│⿻ *Title:* ${video.title}\n` +
            `│⿻ *Duration:* ${video.timestamp}\n` +
            `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
            `│⿻ *Uploaded:* ${video.ago}\n` +
            `│⿻ *Channel:* ${video.author.name}\n` +
            `╰────────────────◆\n\n` +
            `🔗 ${video.url}`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363347365643318@newsletter',
              newsletterName: 'IRON-MAN-MD',
              serverMessageId: -1
            }
          }
        };

        await king.sendMessage(fromJid, message, { quoted: msg });

        await king.sendMessage(fromJid, {
          video: { url: data.downloadLink },
          mimetype: 'video/mp4',
          fileName
        }, { quoted: msg });

      } catch (err) {
        console.error('[VIDEO] Error:', err);
        await king.sendMessage(fromJid, {
          text: 'An error occurred while processing your request.'
        }, { quoted: msg });
      }
    }
  }
];
