import { LANGUAGES, setUserLang, getUserLang } from '../france/translator.js';
import { t, translate, translateAIResponse } from '../france/translator.js';

export const commands = [
  {
    name: 'language',
    aliases: ['lang', 'idioma', 'lugha', 'bahasa'],
    description: 'Set your preferred language',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      const langCode = text.trim().toLowerCase();
      const currentLang = getUserLang(from);
      
      if (!langCode) {
        const availableMsg = await t(from, 'language', 'available');
        const currentMsg = await t(from, 'language', 'current');
        const usageMsg = await t(from, 'language', 'usage');
        
        const available = Object.entries(LANGUAGES)
          .map(([code, name]) => {
            const marker = code === currentLang ? '✅ ' : '   ';
            return `${marker}${code} = ${name}`;
          })
          .join('\n');
        
        return sock.sendMessage(from, { 
          text: `${availableMsg}\n\n${available}\n\n${currentMsg} ${LANGUAGES[currentLang]}\n\n${usageMsg}`
        });
      }
      
      if (!LANGUAGES[langCode]) {
        const notSupportedMsg = await t(from, 'language', 'notSupported');
        const supportedMsg = await t(from, 'language', 'supported');
        const exampleMsg = await t(from, 'language', 'example');
        const available = Object.keys(LANGUAGES).join(', ');
        return sock.sendMessage(from, { 
          text: `${notSupportedMsg} "${langCode}".\n\n${supportedMsg} ${available}\n\n${exampleMsg} .language sw`
        });
      }
      
      setUserLang(from, langCode);
      const langName = LANGUAGES[langCode];
      const successMsg = await t(from, 'language', 'success');
      const responseMsg = await t(from, 'language', 'response');
      
      await sock.sendMessage(from, { 
        text: `${successMsg} ${langName}.\n\n${responseMsg} ${langName}.`
      });
    }
  }
];
