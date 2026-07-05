import { igdl } from 'ruhend-scraper'

async function getInstaMedia(url) {
  try {
    const res = await igdl(url)
    const data = await res.data
    if (!data || data.length === 0) {
      return { error: 'No media found', data: [] }
    }
    return { error: null, data }
  } catch (err) {
    return { error: err.message, data: [] }
  }
}

export { getInstaMedia }
