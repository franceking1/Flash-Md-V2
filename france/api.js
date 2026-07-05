import axios from 'axios';
import { API_CONFIG, LIMITS } from './config.js';
import getFBInfo from '@xaviabot/fb-downloader';
import { search, download } from 'aptoide_scrapper_fixed';
import fetch from 'node-fetch';
import mumaker from 'mumaker';
import { MESSAGES } from './config.js';
import acrcloud from 'acrcloud';

export async function identifySong(buffer) {
  const acr = new acrcloud({
    host: API_CONFIG.acrcloud.host,
    access_key: API_CONFIG.acrcloud.access_key,
    access_secret: API_CONFIG.acrcloud.access_secret
  });
  const result = await acr.identify(buffer);
  if (result.status.code !== 0 || !result.metadata?.music?.length) return null;
  return result.metadata.music[0];
}

export async function callGeminiAPI(prompt) {
  const { data } = await axios.post(API_CONFIG.gemini.url, {
    model: API_CONFIG.gemini.model,
    messages: [{ role: 'user', content: prompt }]
  }, {
    timeout: LIMITS.defaultTimeout,
    headers: { 'Content-Type': 'application/json' }
  });
  return data?.choices?.[0]?.message?.content;
}

export async function callLlamaAPI(prompt) {
  const url = `${API_CONFIG.llama.url}?prompt=${encodeURIComponent(prompt)}`;
  const { data } = await axios.get(url);
  return data?.response?.response?.trim();
}

export async function getRandomWallpaper() {
  const { data } = await axios.get(API_CONFIG.unsplash.url, {
    params: { client_id: API_CONFIG.unsplash.clientId }
  });
  return data?.urls?.regular;
}

export async function generatePairCode(number) {
  const url = `${API_CONFIG.pairing.url}?number=${encodeURIComponent(number)}`;
  const { data } = await axios.get(url, { timeout: LIMITS.pairingTimeout });
  return data?.code;
}

export async function getRandomJoke() {
  const response = await fetch(API_CONFIG.jokes);
  if (!response.ok) throw new Error('Network response was not ok.');
  const data = await response.json();
  return data.joke;
}
export async function fetchElement(query) {
  const response = await fetch(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}

export async function getRandomAdvice() {
  const response = await fetch(API_CONFIG.advice);
  const data = await response.json();
  return data.slip.advice;
}

export async function getRandomTrivia() {
  const response = await fetch(API_CONFIG.trivia);
  if (!response.ok) throw new Error(`Invalid API response: ${response.status}`);
  const result = await response.json();
  if (!result.results || !result.results[0]) throw new Error('No trivia data received.');
  return result.results[0];
}

export async function getRandomQuote() {
  const response = await fetch(API_CONFIG.quotes);
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

export async function spotifySearch(query) {
  const response = await axios.get(`${API_CONFIG.spotifyApi}?q=${encodeURIComponent(query)}`);
  return response.data;
}

export async function alldlDownload(url) {
  const response = await axios.get(`${API_CONFIG.noobsApi}/dipto/alldl?url=${encodeURIComponent(url)}`);
  return response.data;
}

export async function npmSearch(query) {
  const response = await axios.get(`${API_CONFIG.npmApi}/npm?query=${encodeURIComponent(query)}`);
  return response.data;
}

export async function videoDownload(url) {
  const response = await fetch(`${API_CONFIG.bk9Api}/alldownload?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  return data;
}

export async function telegramStickerPack(url) {
  const response = await fetch(`${API_CONFIG.npmApi}/telesticker?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  return data;
}

export async function facebookDownload(url) {
  return await getFBInfo(url);
}

export async function githubRepoInfo(user, repo) {
  const url = `https://api.github.com/repos/${user}/${repo}/zipball`;
  return url;
}

export async function mediafireDownload(url) {
  const response = await axios.get(`${API_CONFIG.npmApi}/mediafiredl?url=${encodeURIComponent(url)}`);
  
  return response.data;
}

export async function apkSearch(query) {
  const results = await search(query);
  if (!results || results.length === 0) return null;
  const apk = results[0];
  const dlInfo = await download(apk.id);
  return { apk, dlInfo };
}

export async function exchangeRates(base) {
  const response = await axios.get(`${API_CONFIG.exchangeApi}/${base.toUpperCase()}`);
  return response.data;
}

export async function imdbSearch(query) {
  const response = await axios.get(`${API_CONFIG.omdbApi}&t=${encodeURIComponent(query)}&plot=full`);
  return response.data;
}

export async function emojimix(emoji1, emoji2) {
  const response = await axios.get(`${API_CONFIG.emojimixApi}?q=${emoji1}${emoji2}`);
  return response.data;
}

export async function fetchUrlContent(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    maxContentLength: LIMITS.maxFetchSize,
    validateStatus: () => true
  });
  return response;
}

export async function translateText(text, toLang) {
  const response = await axios.get(`${API_CONFIG.translate.url}?text=${encodeURIComponent(text)}&to=${toLang}`);
  return response.data?.translated || response.data?.result || 'Translation failed';
}

export async function takeScreenshot(url) {
  const puppeteer = await import('puppeteer');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  const screenshot = await page.screenshot({ fullPage: true });
  await browser.close();
  
  return screenshot;
}

export async function getBibleVerse(reference) {
  const response = await fetch(`${API_CONFIG.bible.url}/${reference}`);
  if (!response.ok) throw new Error('Invalid reference');
  const data = await response.json();
  return data;
}

export async function getRandomFact() {
  const response = await fetch(API_CONFIG.facts.url);
  const data = await response.json();
  return data.fact;
}

export async function getRandomQuoteApi() {
  const response = await fetch(API_CONFIG.quotesApi.url);
  const data = await response.json();
  return data.quote;
}

export async function defineTerm(term) {
  const { data } = await axios.get(`${API_CONFIG.urbanDict.url}?term=${term}`);
  if (!data.list || data.list.length === 0) throw new Error('No definition found');
  return data.list[0];
}

export async function generateLogo(sock, from, text, msg, type, url) {
  if (!text) {
    return await sock.sendMessage(from, { 
      text: MESSAGES.logo.noText.replace('{type}', type) 
    }, { quoted: msg });
  }
  
  try {
    await sock.sendMessage(from, { 
      text: MESSAGES.logo.generating 
    }, { quoted: msg });
    
    const result = await mumaker.ephoto(url, text);
    
    await sock.sendMessage(from, {
      image: { url: result.image },
      caption: MESSAGES.logo.caption
    }, { quoted: msg });
  } catch (error) {
    await sock.sendMessage(from, {
      text: MESSAGES.logo.error
    }, { quoted: msg });
  }
}
export async function googleSearch(query) {
  const { data } = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
    params: {
      q: query,
      key: API_CONFIG.google.apiKey,
      cx: API_CONFIG.google.cx
    }
  });
  return data.items || [];
}

export async function getGithubUser(username) {
  const { data } = await axios.get(`https://api.github.com/users/${username}`);
  return data;
}

export async function getYouTubeMP3(videoId) {
  try {
    const apiURL = `${API_CONFIG.noobsApi}/dipto/ytDl3?link=${videoId}&format=mp3`;
    const { data } = await axios.get(apiURL);
    if (!data?.success || !data.downloadLink) {
      return { error: 'Failed to retrieve download link', downloadLink: null };
    }
    return { error: null, downloadLink: data.downloadLink };
  } catch (err) {
    return { error: err.message, downloadLink: null };
  }
}
