import axios from 'axios';

const BASE_URL = 'https://noobs-api.top';

async function getYouTubeMP3(videoId) {
  try {
    const apiURL = `${BASE_URL}/dipto/ytDl3?link=${videoId}&format=mp3`;
    const { data } = await axios.get(apiURL);
    if (!data?.success || !data.downloadLink) {
      return { error: 'Failed to retrieve download link', downloadLink: null };
    }
    return { error: null, downloadLink: data.downloadLink };
  } catch (err) {
    return { error: err.message, downloadLink: null };
  }
}

export { getYouTubeMP3 };
