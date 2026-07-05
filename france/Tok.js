
import axios from 'axios';
import { load } from 'cheerio';
import qs from 'qs';

async function getTikTokMedia(url) {
  try {
    const data = qs.stringify({ q: url });

    const config = {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://example.com',
        'Referer': 'https://example.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const response = await axios.post('https://tiksave.io/api/ajaxSearch', data, config);
    const rawHtml = response.data?.data;

    if (typeof rawHtml !== 'string') {
      return { status: false, message: 'Unexpected response format.' };
    }

    const $ = load(rawHtml);
    const title = $('h3').first().text().trim();
    let videoUrl = null;
    let audioUrl = null;

    $('a.tik-button-dl').each((_, el) => {
      const btnText = $(el).text().toLowerCase();
      const link = $(el).attr('href');

      if (btnText.includes('mp4') && !videoUrl) videoUrl = link;
      if (btnText.includes('mp3') && !audioUrl) audioUrl = link;
    });

    return {
      status: true,
      title,
      video: videoUrl,
      audio: audioUrl
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export default getTikTokMedia; 
