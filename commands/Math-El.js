import { fetchStories, fetchElement, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'math',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      const input = text.replace(/\s+/g, '');

      if (!/^[0-9+\-*/().]+$/.test(input)) {
        const invalidFormatMsg = await t(from, 'math', 'invalidFormat');
        return sock.sendMessage(from, { 
          text: invalidFormatMsg
        }, { quoted: msg });
      }

      try {
        const result = eval(input);
        if (!isFinite(result)) {
          const invalidOpMsg = await t(from, 'math', 'invalidOperation');
          return sock.sendMessage(from, { 
            text: invalidOpMsg
          }, { quoted: msg });
        }

        const resultMsg = await t(from, 'math', 'result');
        await sock.sendMessage(from, { 
          text: resultMsg.replace('{result}', result)
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'math', 'error');
        await sock.sendMessage(from, { 
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'element',
    aliases: ['chem', 'study'],
    category: 'User',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const noQueryMsg = await t(from, 'element', 'noQuery');
        return sock.sendMessage(from, {
          text: noQueryMsg
        }, { quoted: msg });
      }

      try {
        const result = await fetchElement(text);

        if (result && !result.error) {
          const userLang = getUserLang(from);
          
          const translatedName = await translate(result.name, userLang);
          const translatedPhase = await translate(result.phase, userLang);
          const translatedDiscoveredBy = result.discovered_by ? await translate(result.discovered_by, userLang) : 'Unknown';
          
          const infoTemplate = await t(from, 'element', 'info');
          const info = infoTemplate
            .replace('{name}', translatedName)
            .replace('{symbol}', result.symbol)
            .replace('{atomic_number}', result.atomic_number)
            .replace('{atomic_mass}', result.atomic_mass)
            .replace('{period}', result.period)
            .replace('{phase}', translatedPhase)
            .replace('{discovered_by}', translatedDiscoveredBy);

          if (result.image) {
            await sock.sendMessage(from, {
              image: { url: result.image },
              caption: info
            }, { quoted: msg });
          } else {
            await sock.sendMessage(from, {
              text: info
            }, { quoted: msg });
          }
        } else {
          const notFoundMsg = await t(from, 'element', 'notFound');
          await sock.sendMessage(from, {
            text: notFoundMsg
          }, { quoted: msg });
        }
      } catch (error) {
        const errorMsg = await t(from, 'element', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'story',
    aliases: ['igstories', 'stories'],
    description: 'Fetch Instagram stories using.',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      const username = text?.toLowerCase();
      if (!username) {
        const noUsernameMsg = await t(from, 'story', 'noUsername');
        return sock.sendMessage(from, {
          text: noUsernameMsg
        }, { quoted: msg });
      }

      try {
        const res = await fetchStories(username);

        if (!res || res.total === 0 || !Array.isArray(res.items)) {
          const noStoriesMsg = await t(from, 'story', 'noStories');
          return sock.sendMessage(from, {
            text: noStoriesMsg.replace('{username}', username)
          }, { quoted: msg });
        }

        const stories = res.items.slice(0, 5);

        for (const [index, item] of stories.entries()) {
          const captionTemplate = await t(from, 'story', 'caption');
          const caption = captionTemplate
            .replace('{username}', username)
            .replace('{current}', index + 1)
            .replace('{total}', stories.length);

          if (item.type === 'image') {
            await sock.sendMessage(from, {
              image: { url: item.url },
              caption
            }, { quoted: msg });
          } else if (item.type === 'video') {
            await sock.sendMessage(from, {
              video: { url: item.url },
              caption
            }, { quoted: msg });
          } else {
            const unknownMsg = await t(from, 'story', 'unknown');
            await sock.sendMessage(from, {
              text: unknownMsg.replace('{url}', item.url)
            }, { quoted: msg });
          }
        }

      } catch (error) {
        console.error('Error fetching Instagram stories:', error);
        const errorMsg = await t(from, 'story', 'error');
        return sock.sendMessage(from, {
          text: errorMsg.replace('{username}', username)
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'image-dl',
    aliases: ['imgdl'],
    description: 'Download high-quality images from social media URLs',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const noUrlMsg = await t(from, 'imageDl', 'noUrl');
        return sock.sendMessage(from, {
          text: noUrlMsg
        }, { quoted: msg });
      }

      try {
        const res = await fetch(`https://bk9.fun/download/alldownload?url=${encodeURIComponent(text)}`);
        const data = await res.json();

        if (data.status && data.BK9 && data.BK9.high) {
          const captionMsg = await t(from, 'imageDl', 'caption');
          const successMsg = await t(from, 'imageDl', 'success');
          
          await sock.sendMessage(from, {
            image: { url: data.BK9.high },
            caption: captionMsg
          }, { quoted: msg });

          await sock.sendMessage(from, {
            text: successMsg
          }, { quoted: msg });
        } else {
          const noImageMsg = await t(from, 'imageDl', 'noImage');
          await sock.sendMessage(from, {
            text: noImageMsg
          }, { quoted: msg });
        }
      } catch (error) {
        console.error('Image-DL Error:', error);
        const errorMsg = await t(from, 'imageDl', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
