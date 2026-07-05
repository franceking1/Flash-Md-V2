import { googleSearch, getGithubUser, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'google',
    aliases: ['Search'],
    description: 'Search Google and get top results.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      
      if (!text) {
        const noQueryMsg = await t(from, 'google', 'noQuery');
        return sock.sendMessage(from, {
          text: noQueryMsg
        }, { quoted: msg });
      }
      
      try {
        const results = await googleSearch(text);
        
        if (!results || results.length === 0) {
          const noResultsMsg = await t(from, 'google', 'noResults');
          return sock.sendMessage(from, {
            text: noResultsMsg
          }, { quoted: msg });
        }
        
        const headerMsg = await t(from, 'google', 'header');
        let resultsText = headerMsg.replace('{query}', text);
        
        const itemTemplate = await t(from, 'google', 'item');
        results.slice(0, 5).forEach(item => {
          resultsText += itemTemplate
            .replace('{title}', item.title)
            .replace('{snippet}', item.snippet)
            .replace('{link}', item.link);
        });
        
        await sock.sendMessage(from, {
          text: resultsText.trim(),
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
        const errorMsg = await t(from, 'google', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'github',
    aliases: ['gh'],
    description: 'Fetch GitHub user profile info.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const args = text.trim().split(/\s+/);
      const username = args[0];
      
      if (!username) {
        const noUsernameMsg = await t(from, 'github', 'noUsername');
        return sock.sendMessage(from, {
          text: noUsernameMsg
        }, { quoted: msg });
      }
      
      try {
        const data = await getGithubUser(username);
        
        if (data.message === 'Not Found') {
          const notFoundMsg = await t(from, 'github', 'notFound');
          return sock.sendMessage(from, {
            text: notFoundMsg
          }, { quoted: msg });
        }
        
        const profilePic = `https://github.com/${data.login}.png`;
        
        const infoTemplate = await t(from, 'github', 'info');
        const userInfo = infoTemplate
          .replace('{name}', data.name || 'N/A')
          .replace('{login}', data.login)
          .replace('{bio}', data.bio || 'N/A')
          .replace('{company}', data.company || 'N/A')
          .replace('{location}', data.location || 'N/A')
          .replace('{email}', data.email || 'N/A')
          .replace('{blog}', data.blog || 'N/A')
          .replace('{repos}', data.public_repos)
          .replace('{followers}', data.followers)
          .replace('{following}', data.following);
        
        await sock.sendMessage(from, {
          image: { url: profilePic },
          caption: userInfo,
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
        const errorMsg = await t(from, 'github', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  }
];
