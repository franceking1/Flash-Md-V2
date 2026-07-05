import { 
  geminiVision2, 
  intelQuery,
  callGeminiAPI,
  callLlamaAPI,
  getRandomWallpaper,
  generatePairCode,
  getRandomJoke,
  getRandomAdvice,
  getRandomTrivia,
  getRandomQuote,
  formatPhoneNumber,
  truncateMessage,
  formatError,
  isValidPhoneNumber,
  delay,
  MESSAGES,
  LIMITS,
  gpt41Nano,
  gpt41Mini,
  gpt41,
  o4Mini,
  deepseekR1,
  deepseekV3,
  claude37,
  gemini20,
  grok3Mini,
  qwenQwq32b,
  gpt4o,
  o3,
  gpt4oMini,
  llama33
} from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';
import axios from 'axios';

export const commands = [
  {
    name: 'deepseek',
    aliases: ['intel', 'findout'],
    description: 'Conducts an AI-powered investigation and returns summarized insights.',
    category: 'AI',
    execute: async ({ sock, from, text, msg }) => {
      const inputQuery = text.trim();

      if (!inputQuery) {
        const msgText = await t(from, 'deepseek', 'noQuery');
        return sock.sendMessage(from, { text: msgText });
      }

      try {
        const gatheringMsg = await t(from, 'deepseek', 'gathering');
        await sock.sendMessage(from, { text: gatheringMsg });
        const data = await intelQuery(inputQuery);

        let summary = data.summary?.trim() || '_No summary available._';
        summary = await translateAIResponse(from, summary);
        
        const references = data.references?.length
          ? '\n🌍 *References:*\n' + data.references.map((url, idx) => `${idx + 1}. ${url}`).join('\n')
          : '';
        const cost = data.stats?.cost ? `\n💰 *Estimated Cost:* $${data.stats.cost.toFixed(2)}` : '';
        const agent = data.stats?.engine ? `\n🤖 *Agent Type:* ${data.stats.engine}` : '';
        const stats = `\n📑 *Pages:* ${data.stats.pages} | 🖼 *Images:* ${data.stats.images}`;

        const messageBody = `🧾 *Intel Report:*\n\n${summary}${references}${cost}${agent}${stats}`;
        const output = truncateMessage(messageBody);

        await sock.sendMessage(from, { text: output });
      } catch (err) {
        const errorMsg = await t(from, 'deepseek', 'error');
        await sock.sendMessage(from, { text: formatError(err, errorMsg) });
      }
    }
  },
  {
    name: 'imagine',
    aliases: ['draw', 'generate'],
    description: 'Generate an image using AI API.',
    category: 'AI',
    execute: async ({ sock, from, text, msg }) => {
      const imagePrompt = text?.trim();

      if (!imagePrompt) {
        const noPromptMsg = await t(from, 'imagine', 'noPrompt');
        return sock.sendMessage(from, {
          text: noPromptMsg
        });
      }

      try {
        const generatingMsg = await t(from, 'imagine', 'generating');
        await sock.sendMessage(from, {
          text: generatingMsg
        });

        const enhancedPrompt = `${imagePrompt}, ultra realistic, 4k, cinematic lighting, highly detailed`;

        const url = `https://shizoapi.onrender.com/api/ai/imagine?apikey=shizo&query=${encodeURIComponent(enhancedPrompt)}`;

        const res = await axios.get(url, {
          responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(res.data);
        const captionMsg = await t(from, 'imagine', 'caption');

        await sock.sendMessage(from, {
          image: buffer,
          caption: `${captionMsg} ${imagePrompt}`
        });

      } catch (err) {
        console.error('Imagine Error:', err);
        const errorMsg = await t(from, 'imagine', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        });
      }
    }
  }, 
  {
    name: 'gemini',
    aliases: [],
    description: 'Ask anything using Gemini AI.',
    category: 'AI',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const msgText = await t(from, 'gemini', 'noQuestion');
        return sock.sendMessage(from, { text: msgText });
      }

      const prompt = text.trim();

      try {
        const response = await callGeminiAPI(prompt);
        const translatedResponse = await translateAIResponse(from, response || 'No response from AI.');
        await sock.sendMessage(from, {
          text: translatedResponse
        });
      } catch (err) {
        console.error('AI API Error:', err.message);
        const errorMsg = await t(from, 'gemini', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'llama',
    aliases: [],
    description: 'Ask LLaMA AI a question or prompt.',
    category: 'AI',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const msgText = await t(from, 'llama', 'noQuestion');
        return sock.sendMessage(from, { text: msgText });
      }

      const prompt = text;

      try {
        const response = await callLlamaAPI(prompt);
        if (!response) {
          const noResponseMsg = await t(from, 'llama', 'noResponse');
          return sock.sendMessage(from, { text: noResponseMsg });
        }

        const translatedResponse = await translateAIResponse(from, response);
        await sock.sendMessage(from, {
          text: `*LLaMA says:*\n\n${translatedResponse}`
        });
      } catch (error) {
        console.error('LLaMA API Error:', error);
        const errorMsg = await t(from, 'llama', 'error');
        sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'gpt',
    aliases: [],
    description: 'Ask anything using GPT AI.',
    category: 'AI',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const msgText = await t(from, 'gpt', 'noPrompt');
        return sock.sendMessage(from, { text: msgText });
      }

      const prompt = text.trim();

      try {
        await sock.sendMessage(from, { text: '🤖 *GPT is thinking...*' });
        
        const response = await gpt4o(prompt);
        const translatedResponse = await translateAIResponse(from, response);
        
        await sock.sendMessage(from, {
          text: `*🤖 GPT says:*\n\n${translatedResponse}`
        });
      } catch (error) {
        console.error('GPT API Error:', error);
        const errorMsg = await t(from, 'gpt', 'error');
        sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'jokes',
    aliases: [],
    description: 'Get a random joke.',
    category: 'Fun',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const joke = await getRandomJoke();
        const userLang = getUserLang(from);
        const translatedJoke = await translate(joke, userLang);
        await sock.sendMessage(from, { text: translatedJoke });
      } catch (error) {
        console.error('Error fetching joke:', error.message);
        const errorMsg = await t(from, 'jokes', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'advice',
    aliases: [],
    description: 'Get a random piece of advice.',
    category: 'Fun',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const advice = await getRandomAdvice();
        const userLang = getUserLang(from);
        const translatedAdvice = await translate(advice, userLang);
        const headerMsg = await translate('Here is some advice for you:', userLang);
        await sock.sendMessage(from, {
          text: `*${headerMsg}* \n${translatedAdvice}`
        });
      } catch (error) {
        console.error('Error:', error.message || 'An error occurred');
        const errorMsg = await t(from, 'advice', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'trivia',
    aliases: [],
    description: 'Get a random trivia question.',
    category: 'Fun',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const trivia = await getRandomTrivia();
        const userLang = getUserLang(from);
        
        const question = await translate(trivia.question, userLang);
        const correctAnswer = trivia.correct_answer;
        
        const translatedAnswers = await Promise.all(
          [...trivia.incorrect_answers, correctAnswer].map(ans => translate(ans, userLang))
        );
        const sortedAnswers = translatedAnswers.sort();
        const answers = sortedAnswers.map((ans, i) => `${i + 1}. ${ans}`).join('\n');
        
        const triviaHeader = await translate('Trivia Time!', userLang);
        const revealMsg = await translate("I'll reveal the correct answer in 10 seconds...", userLang);
        
        await sock.sendMessage(from, {
          text: `🤔 *${triviaHeader}*\n\n${question}\n\n${answers}\n\n_${revealMsg}_`
        });

        await delay(10000);
        
        const correctMsg = await translate('Correct Answer:', userLang);
        const translatedCorrect = await translate(correctAnswer, userLang);
        await sock.sendMessage(from, {
          text: `✅ *${correctMsg}* ${translatedCorrect}`
        });
      } catch (error) {
        console.error('Trivia Error:', error.message);
        const errorMsg = await t(from, 'trivia', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'inspire',
    aliases: [],
    description: 'Get an inspirational quote.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const quote = await getRandomQuote();
        const userLang = getUserLang(from);
        
        const translatedText = await translate(quote.text, userLang);
        const author = quote.author || "Unknown";
        const translatedAuthor = author !== "Unknown" ? await translate(author, userLang) : "Unknown";
        const headerMsg = await translate('Inspirational Quote:', userLang);
        
        await sock.sendMessage(from, {
          text: `✨ *${headerMsg}*\n"${translatedText}"\n— ${translatedAuthor}`
        });
      } catch (error) {
        console.error('Inspire Error:', error.message);
        const errorMsg = await t(from, 'inspire', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'pair',
    description: 'Generates a pairing code for a phone number.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const msgText = await t(from, 'pair', 'noNumber');
        return sock.sendMessage(from, { text: msgText });
      }

      const number = text.trim().replace(/\D/g, '');
      if (!isValidPhoneNumber(number)) {
        const invalidMsg = await t(from, 'pair', 'invalid');
        return sock.sendMessage(from, { text: invalidMsg });
      }

      const formattedNumber = formatPhoneNumber(number);

      try {
        const generatingMsg = await t(from, 'pair', 'generating');
        await sock.sendMessage(from, {
          text: generatingMsg.replace('{number}', formattedNumber)
        });

        const code = await generatePairCode(number);

        if (!code) {
          const errorMsg = await t(from, 'pair', 'error');
          return sock.sendMessage(from, { text: errorMsg });
        }

        const headerMsg = await t(from, 'pair', 'success');
        await sock.sendMessage(from, {
          text: headerMsg.replace('{number}', formattedNumber).replace('{code}', code)
        });
      } catch (error) {
        console.error('Pairing Code Error:', error);

        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          const timeoutMsg = await t(from, 'pair', 'timeout');
          await sock.sendMessage(from, { text: timeoutMsg });
        } else {
          const errorMsg = await t(from, 'pair', 'error');
          await sock.sendMessage(from, { text: errorMsg });
        }
      }
    }
  },
  {
    name: 'best-wallp',
    aliases: ['bestwal', 'best', 'bw'],
    description: 'Sends a high-quality random wallpaper.',
    category: 'FLASH PICS',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const url = await getRandomWallpaper();
        if (!url) {
          const errorMsg = await t(from, 'wallpaper', 'error');
          return sock.sendMessage(from, { text: errorMsg });
        }
        const captionMsg = await t(from, 'wallpaper', 'caption');
        await sock.sendMessage(from, {
          image: { url },
          caption: captionMsg
        });
      } catch (error) {
        console.error('Wallpaper Error:', error);
        const errorMsg = await t(from, 'wallpaper', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  },
  {
    name: 'random',
    aliases: [],
    description: 'Sends a random wallpaper from Unsplash.',
    category: 'FLASH PICS',
    execute: async ({ sock, from, text, msg }) => {
      try {
        const url = await getRandomWallpaper();
        if (!url) {
          const errorMsg = await t(from, 'wallpaper', 'error');
          return sock.sendMessage(from, { text: errorMsg });
        }
        const captionMsg = await t(from, 'wallpaper', 'caption');
        await sock.sendMessage(from, {
          image: { url },
          caption: captionMsg
        });
      } catch (error) {
        console.error('Random Wallpaper Error:', error);
        const errorMsg = await t(from, 'wallpaper', 'error');
        await sock.sendMessage(from, { text: errorMsg });
      }
    }
  }
];
