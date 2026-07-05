import axios from 'axios';
import { API_CONFIG, MESSAGES } from '../france/index.js';
import yts from 'yt-search';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'playlist',
    aliases: ['list', 'pl', 'ytlist'],
    description: 'Fetch and display videos from a YouTube playlist or search by keywords.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      if (!text) {
        const noQueryMsg = await t(from, 'playlist', 'noQuery');
        return sock.sendMessage(from, { 
          text: noQueryMsg
        }, { quoted: msg });
      }

      try {
        const fetchingMsg = await t(from, 'playlist', 'fetching');
        await sock.sendMessage(from, { 
          text: fetchingMsg
        }, { quoted: msg });

        let playlistUrl = text;
        const youtubeRegex = /(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]+)/i;
        
        if (!youtubeRegex.test(text)) {
          const search = await yts(text);
          const video = search.videos?.[0];
          
          if (!video) {
            const noResultsMsg = await t(from, 'playlist', 'noResults');
            return sock.sendMessage(from, { 
              text: noResultsMsg
            }, { quoted: msg });
          }
          
          playlistUrl = video.url;
        }
        
        const apiUrl = `${API_CONFIG.nayanApi.playlist}?url=${encodeURIComponent(playlistUrl)}`;
        const response = await axios.get(apiUrl, { timeout: API_CONFIG.nayanApi.timeout });

        if (!response.data?.status || !response.data?.videos) {
          throw new Error('Failed to fetch playlist');
        }

        const { title, total, videos } = response.data;
        const botName = config.BOT_NAME || 'FLASH-MD V3';
        const userLang = getUserLang(from);

        const playlistHeader = await t(from, 'playlist', 'header');
        const playlistTitle = await t(from, 'playlist', 'playlistTitle');
        const totalLabel = await t(from, 'playlist', 'total');
        const durationLabel = await t(from, 'playlist', 'duration');
        const moreMsg = await t(from, 'playlist', 'more');
        const usageMsg = await t(from, 'playlist', 'usage');
        const poweredMsg = await t(from, 'playlist', 'powered');

        let playlistText = `🎵 *${playlistHeader}*\n\n`;
        playlistText += `${playlistTitle} ${title || 'MIX'}\n`;
        playlistText += `${totalLabel} ${total}\n\n`;

        const limitedVideos = videos.slice(0, 10);
        
        limitedVideos.forEach((video, index) => {
          playlistText += `${index + 1}. *${video.title}*\n`;
          playlistText += `   ${durationLabel} ${video.duration}\n`;
          playlistText += `   🔗 ${video.url}\n\n`;
        });

        if (total > 10) {
          playlistText += moreMsg.replace('{remaining}', total - 10);
        }

        playlistText += `\n${usageMsg}`;
        playlistText += `\n\n${poweredMsg} ${botName}`;

        const thumbnail = limitedVideos[0]?.thumbnail;

        await sock.sendMessage(from, {
          image: { url: thumbnail },
          caption: playlistText,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363238139244263@newsletter',
              newsletterName: botName,
              serverMessageId: -1
            }
          }
        }, { quoted: msg });

      } catch (error) {
        console.error('Playlist error:', error);
        
        let errorMessageKey = 'error';
        
        if (error.code === 'ECONNABORTED') {
          errorMessageKey = 'timeout';
        } else if (error.response?.status === 404) {
          errorMessageKey = 'notFound';
        }
        
        const errorMsg = await t(from, 'playlist', errorMessageKey);
        
        return sock.sendMessage(from, { 
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
