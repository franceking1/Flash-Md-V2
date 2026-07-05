import axios from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import yts from 'yt-search';
import { MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

const BASE_URL = 'https://noobs-api.top';

export const commands = [
  {
    name: 'attp',
    aliases: ['attp-sticker'],
    description: 'Converts text into an ATTP sticker.',
    category: 'User',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'attp', 'noText');
        return await sock.sendMessage(from, { 
          text: noTextMsg 
        }, { quoted: msg });
      }
      
      const gifUrl = `https://raganork-api.onrender.com/api/attp?text=${encodeURIComponent(text)}&apikey=with_love_souravkl11`;
      
      try {
        const packname = msg.pushName || botName;
        const stickerMess = new Sticker(gifUrl, {
          pack: packname,
          author: botName,
          type: StickerTypes.FULL,
          categories: ['🤩', '🎉'],
          id: '12345',
          quality: 40,
          background: 'transparent'
        });
        const stickerBuffer = await stickerMess.toBuffer();
        await sock.sendMessage(from, {
          sticker: stickerBuffer,
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
      } catch {
        const errorMsg = await t(from, 'attp', 'error');
        await sock.sendMessage(from, {
          text: errorMsg,
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
      }
    }
  },
  {
    name: 'stickersearch',
    aliases: ['stsearch', 'stickerfind'],
    description: 'Search and create stickers from Tenor GIFs.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'stickersearch', 'noText');
        return await sock.sendMessage(from, {
          text: noTextMsg,
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
      }
      
      try {
        const res = await axios.get(`https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c&client_key=my_project&limit=5&media_filter=gif`);
        const gifs = res.data.results;
        
        for (let gif of gifs) {
          const sticker = new Sticker(gif.media_formats.gif.url, {
            pack: msg.pushName || botName,
            author: botName,
            type: StickerTypes.FULL,
            quality: 60,
            background: 'transparent'
          });
          const buffer = await sticker.toBuffer();
          await sock.sendMessage(from, {
            sticker: buffer,
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
        }
      } catch {
        const errorMsg = await t(from, 'stickersearch', 'error');
        await sock.sendMessage(from, {
          text: errorMsg,
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
      }
    }
  },
  {
    name: 'weather',
    aliases: ['climate'],
    description: 'Get the current weather for a specific location.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'weather', 'noText');
        return await sock.sendMessage(from, {
          text: noTextMsg,
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
      }
      
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: text,
            units: 'metric',
            appid: '060a6bcfa19809c2cd4d97a212b19273',
            language: 'en'
          }
        });
        
        const data = res.data;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        const rain = data.rain ? data.rain['1h'] : 0;
        
        const resultTemplate = await t(from, 'weather', 'result');
        const weatherText = resultTemplate
          .replace('{name}', data.name)
          .replace('{country}', data.sys.country)
          .replace('{temp}', data.main.temp)
          .replace('{feels}', data.main.feels_like)
          .replace('{min}', data.main.temp_min)
          .replace('{max}', data.main.temp_max)
          .replace('{desc}', data.weather[0].description)
          .replace('{humidity}', data.main.humidity)
          .replace('{wind}', data.wind.speed)
          .replace('{clouds}', data.clouds.all)
          .replace('{rain}', rain)
          .replace('{sunrise}', sunrise)
          .replace('{sunset}', sunset)
          .replace('{lat}', data.coord.lat)
          .replace('{lon}', data.coord.lon)
          .replace('{botName}', botName);
        
        await sock.sendMessage(from, {
          text: weatherText,
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
      } catch {
        const errorMsg = await t(from, 'weather', 'error');
        await sock.sendMessage(from, {
          text: errorMsg,
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
      }
    }
  },
  {
    name: 'yts',
    aliases: ['ytsearch'],
    description: 'Searches YouTube videos by keyword.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'yts', 'noText');
        return await sock.sendMessage(from, {
          text: noTextMsg,
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
      }
      
      try {
        const info = await yts(text);
        const videos = info.videos.slice(0, 10);
        
        const headerTemplate = await t(from, 'yts', 'header');
        let resultText = headerTemplate.replace('{query}', text);
        
        const itemTemplate = await t(from, 'yts', 'item');
        for (let i = 0; i < videos.length; i++) {
          resultText += itemTemplate
            .replace('{num}', i + 1)
            .replace('{title}', videos[i].title)
            .replace('{channel}', videos[i].author.name)
            .replace('{duration}', videos[i].timestamp)
            .replace('{url}', videos[i].url);
        }
        
        const footerTemplate = await t(from, 'yts', 'footer');
        await sock.sendMessage(from, {
          image: { url: videos[0].thumbnail },
          caption: resultText + footerTemplate.replace('{botName}', botName),
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
      } catch {
        const errorMsg = await t(from, 'yts', 'error');
        await sock.sendMessage(from, {
          text: errorMsg,
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
      }
    }
  },
  {
    name: 'ytmp3',
    aliases: ['mp3'],
    description: 'Search and play MP3 music from YouTube (audio only).',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'ytmp3', 'noText');
        return sock.sendMessage(from, {
          text: noTextMsg
        }, { quoted: msg });
      }
      
      try {
        const search = await yts(text);
        const video = search.videos[0];
        if (!video) {
          const noResultsMsg = await t(from, 'ytmp3', 'noResults');
          return sock.sendMessage(from, {
            text: noResultsMsg
          }, { quoted: msg });
        }
        
        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp3`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        const response = await axios.get(apiURL);
        const data = response.data;
        
        if (!data.downloadLink) {
          const noLinkMsg = await t(from, 'ytmp3', 'noLink');
          return sock.sendMessage(from, {
            text: noLinkMsg
          }, { quoted: msg });
        }
        
        const captionMsg = await t(from, 'ytmp3', 'caption');
        await sock.sendMessage(from, {
          audio: { url: data.downloadLink },
          mimetype: 'audio/mpeg',
          fileName,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363238139244263@newsletter',
              newsletterName: botName,
              serverMessageId: -1
            }
          },
          caption: captionMsg
        }, { quoted: msg });
      } catch (err) {
        console.error('Ytmp3 error:', err);
        const errorMsg = await t(from, 'ytmp3', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'ytmp4',
    aliases: ['ytv', 'ytvideo'],
    description: 'Downloads a YouTube video.',
    category: 'Download',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      if (!text) {
        const noTextMsg = await t(from, 'ytmp4', 'noText');
        return sock.sendMessage(from, {
          text: noTextMsg
        }, { quoted: msg });
      }
      
      try {
        const search = await yts(text);
        const video = search.videos[0];
        if (!video) {
          const noResultsMsg = await t(from, 'ytmp4', 'noResults');
          return sock.sendMessage(from, {
            text: noResultsMsg
          }, { quoted: msg });
        }
        
        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const fileName = `${safeTitle}.mp4`;
        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;
        const response = await axios.get(apiURL);
        const data = response.data;
        
        if (!data.downloadLink) {
          const noLinkMsg = await t(from, 'ytmp4', 'noLink');
          return sock.sendMessage(from, {
            text: noLinkMsg
          }, { quoted: msg });
        }
        
        const captionMsg = await t(from, 'ytmp4', 'caption');
        await sock.sendMessage(from, {
          video: { url: data.downloadLink },
          mimetype: 'video/mp4',
          fileName,
          caption: captionMsg,
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
      } catch (err) {
        console.error('Ytmp4 error:', err);
        const errorMsg = await t(from, 'ytmp4', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
