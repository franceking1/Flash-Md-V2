import axios from 'axios'

export async function geminiVision2(imageBase64, query) {
  if (!imageBase64 || !query) {
    throw new Error('Image data and query are required')
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')

  const headers = {
    authority: 'us-central1-infinite-chain-295909.cloudfunctions.net',
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    origin: 'https://screenapp.io',
    referer: 'https://screenapp.io/',
    'save-data': 'on',
    'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent':
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
  }

  const data = {
    model: 'gemini-2.0-flash',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text:
              'You are a helpful AI assistant analyzing media for users. Provide practical, actionable, and useful information.\n\nUser question: ' +
              query
          }
        ]
      }
    ]
  }

  const response = await axios.post(
    'https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1',
    data,
    { headers }
  )

  const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Failed to analyze image')
  }

  return text
}
