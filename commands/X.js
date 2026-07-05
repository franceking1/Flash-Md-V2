import axios from 'axios';
import { API_CONFIG, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'twitter',
    aliases: ['tw', 'x', 'twdl', 'xdl'],
    description: 'Download videos from Twitter/X using Nayan API.',
    category: 'Download',
    execute: async ({ sock, from, text, msg, config }) => {
      if (!text) {
        const noUrlMsg = await t(from, 'twitter', 'noUrl');
        return sock.sendMessage(from, { 
          text: noUrlMsg
        }, { quoted: msg });
      }

      const twitterRegex = /(twitter\.com|x\.com)\/\w+\/status\/\d+/i;
      if (!twitterRegex.test(text)) {
        const invalidUrlMsg = await t(from, 'twitter', 'invalidUrl');
        return sock.sendMessage(from, { 
          text: invalidUrlMsg
        }, { quoted: msg });
      }

      try {
        console.log('[TWITTER] Starting download process');
        console.log('[TWITTER] URL:', text);
        
        const fetchingMsg = await t(from, 'twitter', 'fetching');
        await sock.sendMessage(from, { 
          text: fetchingMsg
        }, { quoted: msg });

        const apiUrl = `${API_CONFIG.nayanApi.twitter}?url=${encodeURIComponent(text)}`;
        console.log('[TWITTER] API URL:', apiUrl);
        
        console.log('[TWITTER] Sending request to Nayan API...');
        const response = await axios.get(apiUrl, { timeout: API_CONFIG.nayanApi.timeout });
        
        console.log('[TWITTER] Response status:', response.status);
        console.log('[TWITTER] Response data:', JSON.stringify(response.data, null, 2));

        if (!response.data) {
          console.log('[TWITTER] No data in response');
          throw new Error('No data received from API');
        }

        if (!response.data?.status) {
          console.log('[TWITTER] Status false in response');
          console.log('[TWITTER] Error message:', response.data?.message);
          throw new Error('API returned status false');
        }

        if (!response.data?.data) {
          console.log('[TWITTER] No data object in response');
          throw new Error('No data object in API response');
        }

        const { thumbnail, HD, SD } = response.data.data;
        console.log('[TWITTER] Thumbnail:', thumbnail);
        console.log('[TWITTER] HD URL:', HD);
        console.log('[TWITTER] SD URL:', SD);
        
        const videoUrl = HD || SD;
        
        if (!videoUrl) {
          console.log('[TWITTER] No video URL found in response');
          const noVideoMsg = await t(from, 'twitter', 'noVideo');
          return sock.sendMessage(from, { 
            text: noVideoMsg
          }, { quoted: msg });
        }

        const quality = HD ? 'HD' : 'SD';
        console.log('[TWITTER] Video quality:', quality);
        console.log('[TWITTER] Video URL:', videoUrl);
        
        const captionTemplate = await t(from, 'twitter', 'caption');
        const caption = captionTemplate.replace('{quality}', quality);

        console.log('[TWITTER] Sending video to user...');
        await sock.sendMessage(from, {
          video: { url: videoUrl },
          caption: caption,
          thumbnail: thumbnail ? { url: thumbnail } : null,
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
        
        console.log('[TWITTER] Video sent successfully');

      } catch (error) {
        console.error('[TWITTER] Error details:');
        console.error('[TWITTER] Error message:', error.message);
        console.error('[TWITTER] Error code:', error.code);
        
        if (error.response) {
          console.error('[TWITTER] Response status:', error.response.status);
          console.error('[TWITTER] Response data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          console.error('[TWITTER] No response received from API');
          console.error('[TWITTER] Request:', error.request);
        }
        
        let errorKey = 'error';
        
        if (error.code === 'ECONNABORTED') {
          errorKey = 'timeout';
          console.log('[TWITTER] Request timed out');
        } else if (error.response?.status === 404) {
          errorKey = 'notFound';
          console.log('[TWITTER] API endpoint not found (404)');
        } else if (error.message.includes('Failed to fetch')) {
          errorKey = 'apiError';
          console.log('[TWITTER] Failed to fetch from API');
        }
        
        const errorMsg = await t(from, 'twitter', errorKey);
        
        return sock.sendMessage(from, { 
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
