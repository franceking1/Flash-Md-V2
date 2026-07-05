import axios from 'axios';

async function queryRavenn(question) {
    try {
        if (!question) throw new Error('Question is required');
        
        const response = await axios.get('https://ravenn.site/ai/gpt4', {
            params: { q: question },
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (response.data && response.data.status === true && response.data.result) {
            return response.data.result;
        }
        
        throw new Error('Invalid response from API');
    } catch (error) {
        console.error('Ravenn API Error:', error.message);
        throw error;
    }
}

export async function callGeminiAPI(prompt) {
    return queryRavenn(prompt);
}

export async function callLlamaAPI(prompt) {
    return queryRavenn(prompt);
}

export async function gpt41Nano(question) {
    return queryRavenn(question);
}

export async function gpt41Mini(question) {
    return queryRavenn(question);
}

export async function gpt41(question) {
    return queryRavenn(question);
}

export async function o4Mini(question) {
    return queryRavenn(question);
}

export async function deepseekR1(question) {
    return queryRavenn(question);
}

export async function deepseekV3(question) {
    return queryRavenn(question);
}

export async function claude37(question) {
    return queryRavenn(question);
}

export async function gemini20(question) {
    return queryRavenn(question);
}

export async function grok3Mini(question) {
    return queryRavenn(question);
}

export async function qwenQwq32b(question) {
    return queryRavenn(question);
}

export async function gpt4o(question) {
    return queryRavenn(question);
}

export async function o3(question) {
    return queryRavenn(question);
}

export async function gpt4oMini(question) {
    return queryRavenn(question);
}

export async function llama33(question) {
    return queryRavenn(question);
}
