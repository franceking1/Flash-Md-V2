import { 
  translateText,
  getBibleVerse,
  getRandomFact,
  getRandomQuote,
  defineTerm,
  MESSAGES
} from '../france/index.js';

import axios from 'axios';

export const commands = [
  {
    name: 'trt',
    aliases: ['translate'],
    description: 'Translate a replied message to the specified language.',
    category: 'General',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quoted) {
        return sock.sendMessage(from, {
          text: MESSAGES.translate.noReply.replace('{botName}', botName).replace('{botVersion}', botVersion)
        }, { quoted: msg });
      }
      
      const args = text.trim().split(/\s+/);
      if (args.length !== 1) {
        return sock.sendMessage(from, {
          text: MESSAGES.translate.usage.replace('{botName}', botName).replace('{botVersion}', botVersion)
        }, { quoted: msg });
      }
      
      const lang = args[0].toLowerCase();
      const textToTranslate = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
      
      if (!textToTranslate) {
        return sock.sendMessage(from, { 
          text: MESSAGES.translate.noText.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
      
      try {
        const translated = await translateText(textToTranslate, lang);
        await sock.sendMessage(from, { 
          text: `${translated}\n\n⚡ Powered by ${botName} ${botVersion}` 
        }, { quoted: msg });
      } catch (error) {
        await sock.sendMessage(from, {
          text: MESSAGES.translate.error.replace('{botName}', botName).replace('{botVersion}', botVersion)
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'owner',
    description: 'Sends contact card of the bot owner.',
    category: 'General',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      const ownerNumber = config.OWNER_NUMBER || '254742063632';
      const ownerName = config.OWNER_NAME || 'FLASH-MD Owner';
      const formattedPhone = ownerNumber.replace(/\D/g, '');
      
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:${botName} ${botVersion};
TEL;type=CELL;type=VOICE;waid=${formattedPhone}:${formattedPhone}
END:VCARD`;
      
      await sock.sendMessage(from, {
        contacts: {
          displayName: `${ownerName} - ${botName} ${botVersion}`,
          contacts: [{ vcard }]
        }
      }, { quoted: msg });
    }
  },
  {
    name: 'ss',
    description: 'Takes a screenshot of a website using API.',
    category: 'General',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';

      if (!text) {
        return sock.sendMessage(
          from,
          { text: MESSAGES.screenshot.noUrl.replace('{botName}', botName).replace('{botVersion}', botVersion) },
          { quoted: msg }
        );
      }

      let url = text.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const theme = 'light';
      const device = 'desktop';

      const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=${theme}&device=${device}`;

      try {
        const processingMsg = await sock.sendMessage(from, { text: '📸 Taking screenshot...' }, { quoted: msg });
        
        const response = await axios.get(apiUrl, {
          responseType: 'arraybuffer',
          timeout: 30000
        });

        await sock.sendMessage(from, { delete: processingMsg.key });

        await sock.sendMessage(from, {
          image: Buffer.from(response.data),
          caption: `*${botName.toUpperCase()} WEB SCREENSHOT*\n📡 URL: ${url}\n🎨 Theme: ${theme}\n💻 Device: ${device}\n\n⚡ Powered by ${botName} ${botVersion}`
        }, { quoted: msg });

      } catch (error) {
        console.error('Screenshot error:', error);
        await sock.sendMessage(from, { 
          text: MESSAGES.screenshot.error.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'bible',
    description: 'Get a Bible verse from a specific book, chapter, and verse.',
    category: 'General',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      
      if (!text) {
        return sock.sendMessage(from, { 
          text: MESSAGES.bible.usage.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
      
      try {
        const bibleData = await getBibleVerse(text);
        const bibleText = `📖 *THE HOLY BIBLE*\n\n📜 ${bibleData.reference}\n🔢 Verses: ${bibleData.verses.length}\n📝 ${bibleData.text}\n🌍 Language: ${bibleData.translation_name}\n\n⚡ Powered by ${botName} ${botVersion}`;
        await sock.sendMessage(from, { text: bibleText }, { quoted: msg });
      } catch (error) {
        await sock.sendMessage(from, { 
          text: MESSAGES.bible.error.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'poll',
    description: 'Create a poll.',
    category: 'General',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      const input = text;
      const [question, optionsString] = input.split('/');
      
      if (!question || !optionsString) {
        return sock.sendMessage(from, { 
          text: MESSAGES.poll.usage.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
      
      const options = optionsString.split(',').map(opt => opt.trim());
      
      await sock.sendMessage(from, {
        poll: {
          name: `${question.trim()} - ${botName} ${botVersion}`,
          values: options
        }
      }, { quoted: msg });
    }
  },
  {
    name: 'fact',
    description: 'Get a random fact.',
    category: 'User',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      
      try {
        const fact = await getRandomFact();
        await sock.sendMessage(from, {
          text: `◆━━━━━━✦FACT✦━━━━━━◆\n◇ ${fact}\n◇ Powered by ${botName} ${botVersion}\n◇ KEEP USING ${botName}`
        }, { quoted: msg });
      } catch (error) {
        await sock.sendMessage(from, { 
          text: MESSAGES.fact.error.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'quotes',
    description: 'Get a random quote.',
    category: 'User',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      
      try {
        const quote = await getRandomQuote();
        const message = `◆━━━━━━✦QUOTE✦━━━━━━◆\n◇ "${quote.body}"\n◇ — ${quote.author}\n◇ Powered by ${botName} ${botVersion}\n◇ KEEP USING ${botName}`;
        await sock.sendMessage(from, { text: message }, { quoted: msg });
      } catch (error) {
        await sock.sendMessage(from, { 
          text: MESSAGES.quote.error.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'define',
    description: 'Get a definition for a term.',
    category: 'Search',
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      
      if (!text) {
        return sock.sendMessage(from, { 
          text: MESSAGES.define.usage.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
      
      try {
        const definition = await defineTerm(text);
        const responseText = `📚 Word: ${text}\n📝 Definition: ${definition.definition.replace(/[]/g, '')}\n💡 Example: ${definition.example.replace(/[]/g, '')}\n\n⚡ Powered by ${botName} ${botVersion}`;
        return sock.sendMessage(from, { text: responseText }, { quoted: msg });
      } catch {
        return sock.sendMessage(from, { 
          text: MESSAGES.define.notFound.replace('{word}', text).replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'eval',
    aliases: ['evaluate'],
    description: 'Evaluate JavaScript code.',
    category: 'Owner',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg, config }) => {
      const botName = config.BOT_NAME || 'Flash-MD';
      const botVersion = config.BOT_VERSION || '3.0.0';
      
      if (!text) {
        return sock.sendMessage(from, { 
          text: MESSAGES.evalSimple.usage.replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
      
      try {
        let result = await eval(text);
        if (typeof result !== 'string') {
          result = require('util').inspect(result);
        }
        await sock.sendMessage(from, { 
          text: `${String(result)}\n\n⚡ Powered by ${botName} ${botVersion}` 
        }, { quoted: msg });
      } catch (err) {
        await sock.sendMessage(from, { 
          text: MESSAGES.evalSimple.error.replace('{error}', err.message).replace('{botName}', botName).replace('{botVersion}', botVersion) 
        }, { quoted: msg });
      }
    }
  }
];
