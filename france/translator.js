import translatte from 'translatte';
import { MESSAGES as EN_MESSAGES } from './index.js';

const userLanguages = new Map();

export const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  sw: 'Kiswahili',
  ar: 'Arabic',
  pt: 'Portuguese',
  de: 'German',
  zh: 'Chinese',
  hi: 'Hindi',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  it: 'Italian'
};

export const DEFAULT_LANG = 'en';

export function setUserLang(userId, langCode) {
  if (LANGUAGES[langCode]) {
    userLanguages.set(userId, langCode);
    return true;
  }
  return false;
}

export function getUserLang(userId) {
  return userLanguages.get(userId) || DEFAULT_LANG;
}

export async function translate(text, targetLang, replacements = {}) {
  if (!text || targetLang === 'en') {
    let result = text;
    for (const [key, value] of Object.entries(replacements)) {
      result = result?.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }
  
  try {
    let textWithReplacements = text;
    for (const [key, value] of Object.entries(replacements)) {
      textWithReplacements = textWithReplacements?.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    
    const result = await translatte(textWithReplacements, { to: targetLang });
    return result.text;
  } catch (error) {
    let fallback = text;
    for (const [key, value] of Object.entries(replacements)) {
      fallback = fallback?.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return fallback;
  }
}

export async function t(userId, category, key, replacements = {}) {
  const targetLang = getUserLang(userId);
  
  let englishText;
  const keys = key.split('.');
  
  if (keys.length === 1) {
    englishText = EN_MESSAGES[category]?.[key];
  } else {
    let obj = EN_MESSAGES[category];
    for (const k of keys) {
      if (obj) obj = obj[k];
      else break;
    }
    englishText = obj;
  }
  
  if (!englishText) {
    return `Missing: ${category}.${key}`;
  }
  
  return translate(englishText, targetLang, replacements);
}

export async function translateAIResponse(userId, aiText) {
  const targetLang = getUserLang(userId);
  if (targetLang === 'en') return aiText;
  
  try {
    const result = await translatte(aiText, { to: targetLang });
    return result.text;
  } catch (error) {
    return aiText;
  }
}
