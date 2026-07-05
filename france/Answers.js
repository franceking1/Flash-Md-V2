import fetch from 'node-fetch';

async function xenc01(prompt) {
  console.log('[GPT] Starting request with prompt:', prompt);
  
  const apis = [
    {
      name: 'Blackbox AI',
      url: `https://api.blackbox.ai/api/chat`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: (prompt) => JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'blackboxai',
        max_tokens: 1000
      }),
      extract: (data) => data?.response || data?.message
    },
    {
      name: 'GPTGod',
      url: 'https://api.gptgod.online/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: (prompt) => JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      }),
      extract: (data) => data?.choices?.[0]?.message?.content
    },
    {
      name: 'Lepton AI',
      url: 'https://llama3-8b.lepton.run/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key'
      },
      body: (prompt) => JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        stream: false
      }),
      extract: (data) => data?.choices?.[0]?.message?.content
    }
  ];

  for (const api of apis) {
    try {
      console.log(`[GPT] Trying ${api.name}...`);
      
      const response = await fetch(api.url, {
        method: api.method,
        headers: api.headers,
        body: api.body(prompt)
      });
      
      console.log(`[GPT] ${api.name} response status:`, response.status);
      
      if (!response.ok) {
        console.log(`[GPT] ${api.name} failed with status:`, response.status);
        continue;
      }
      
      const data = await response.json();
      console.log(`[GPT] ${api.name} response:`, JSON.stringify(data).slice(0, 200));
      
      const result = api.extract(data);
      
      if (result && result.length > 0) {
        console.log(`[GPT] Success with ${api.name}`);
        return { response: result };
      }
    } catch (error) {
      console.error(`[GPT] ${api.name} error:`, error.message);
      continue;
    }
  }
  
  console.log('[GPT] All APIs failed');
  return { response: 'AI service is currently unavailable. Please try again later.' };
}

export { xenc01 };
