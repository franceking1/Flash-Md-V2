import axios from 'axios';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'repo',
    aliases: ['sc', 'script'],
    description: 'Sends the official GitHub repository and stats for FLASH-MD',
    execute: async ({ sock, from, config, msg }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      const repoApiUrl = 'https://api.github.com/repos/franceking1/Flash-Md-V3';
      const repoUrl = 'https://flash-vercel-iota.vercel.app';

      try {
        const { data } = await axios.get(repoApiUrl);

        const stars = data.stargazers_count.toLocaleString();
        const forks = data.forks_count.toLocaleString();
        const watchers = data.watchers_count.toLocaleString();
        const createdAt = new Date(data.created_at).toLocaleDateString('en-GB');
        const lastUpdated = new Date(data.pushed_at).toLocaleDateString('en-GB');

        const repoInfo = `*🤖 ${botName.toUpperCase()}*

A powerful, open-source WhatsApp bot built for speed, reliability, and ease of use.

*📂 GitHub Repository:*
${repoUrl}

*📊 Repository Stats:*
⭐ *Stars:* ${stars}
🍴 *Forks:* ${forks}
👀 *Watchers:* ${watchers}
📅 *Created:* ${createdAt}
♻️ *Last Updated:* ${lastUpdated}

*⚡ Powered by France King*

_Star ⭐ the repository if you like the bot and want to support future development!_
_Don't forget to fork 🍴 and watch 👀 for updates!_`;

        await sock.sendMessage(from, { 
          text: repoInfo,
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
        console.error('GitHub Repo Error:', error.message);
        const errorMsg = `❌ *Error fetching repository stats*

Could not retrieve FLASH-MD repository information at this time.

*⚡ Powered by France King*`;

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
  }
];
