const { franceking } = require('../main');
const axios = require('axios');

module.exports = {
    name: 'repo',
    get flashOnly() {
  return franceking();
},
    aliases: ['sc', 'script'],
    description: 'Sends the official GitHub repository and stats for FLASH-MD-V2 WhatsApp bot',
    execute: async (sock, msg) => {
        const chatId = msg.key.remoteJid;
        const githubRepoUrl = 'https://api.github.com/repos/franceking1/Flash-Md-V2';

        try {
            const response = await axios.get(githubRepoUrl);
            const data = response.data;

            const stars = data.stargazers_count.toLocaleString();
            const forks = data.forks_count.toLocaleString();
            const createdAt = new Date(data.created_at).toLocaleDateString('en-GB');
            const lastUpdated = new Date(data.pushed_at).toLocaleDateString('en-GB');

            const repoInfo = `*🤖 IRON-MAN-MD*

A powerful, open-source WhatsApp bot built for speed, reliability, and ease of use. Designed to deliver blazing-fast responses and rich features for groups and individuals.

*📂 GitHub Repository:*
https://github.com/Muchinyanya/Kudazvinhu

*⭐ Stars:* ${stars}
*🍴 Forks:* ${forks}
*📅 Created:* ${createdAt}
*♻️ Last Updated:* ${lastUpdated}

_Star ⭐ the repository if you like the bot and want to support future development!_`;

            await sock.sendMessage(chatId, {
                text: repoInfo,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363347365643318@newsletter',
                        newsletterName: 'IRON-MAN-MD',
                        serverMessageId: -1
                    }
                }
            });
        } catch (error) {
            console.error('Error in github command:', error);
            await sock.sendMessage(chatId, {
                text: '❌ Error fetching repository information.'
            });
        }
    }
};
