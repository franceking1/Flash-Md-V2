
import axios from 'axios';
import { load } from 'cheerio';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  Referer: 'https://mollygram.com/',
  Origin: 'https://mollygram.com',
};

async function fetchContent(username, method) {
  try {
    const res = await axios.get(
      `https://media.mollygram.com/?url=${username}&method=${method}`,
      { headers }
    );

    const data = res.data;
    if (data.status !== 'ok' || !data.html) return { total: 0, items: [] };

    const $ = load(data.html);
    const items = [];

    $('.load').each((_, el) => {
      const video = $(el).find('video source').attr('src');
      const image = $(el).find('img').attr('src');

      if (video) {
        items.push({ type: 'video', url: video });
      } else if (image) {
        items.push({ type: 'image', url: image });
      }
    });

    return { total: items.length, items };
  } catch {
    return { total: 0, items: [] };
  }
}

async function fetchAllPosts(username) {
  return fetchContent(username, 'allposts');
}

async function fetchStories(username) {
  return fetchContent(username, 'allstories');
}

export { fetchAllPosts, fetchStories }; 
