import type { ChatMessage, GeminiConfig } from '../types/chat';

const DEFAULT_MODEL = 'gemini-1.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export const getStoredApiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setStoredApiKey = (key: string): void => {
  if (key.trim()) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
};

export async function* streamGeminiResponse(
  messages: ChatMessage[],
  config: GeminiConfig = {}
): AsyncGenerator<string, void, unknown> {
  const apiKey = config.apiKey || getStoredApiKey();
  const model = config.model || DEFAULT_MODEL;

  // Format messages into Gemini API contents structure
  const formattedContents = messages
    .filter((m) => m.role === 'user' || m.role === 'model')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

  const systemPrompt =
    config.systemInstruction ||
    "You are StudyGenie AI, an expert, enthusiastic AI study tutor and academic assistant. You specialize in explaining concepts clearly, providing examples, step-by-step problem solving, code snippets, and study guides. Format your responses with clear Markdown headers, bold highlights, bullet points, and code blocks where relevant.";

  // If no API key is provided, provide an informative streaming fallback message with simulated streaming speed
  if (!apiKey) {
    const mockReply = `Welcome to **StudyGenie AI**! 🚀

*(Note: API Key is currently not set. Please click the **API Key** button at top right to enter your Gemini API Key for live AI model access).*

Here is a quick overview of what I can help you with:
- 💡 **Concept Explanations**: Deep dives into Computer Science, Math, Physics, and more.
- 💻 **Code & Debugging**: Writing clean code examples, fixing bugs, and algorithm design.
- 📝 **Study Plans & Notes**: Structuring revision guides and practice quizzes.

\`\`\`javascript
// Example JavaScript Study Helper
function calculateStudyTime(topics, hoursPerTopic) {
  const total = topics.length * hoursPerTopic;
  return \`Total estimated focus time: \${total} hours\`;
}
console.log(calculateStudyTime(['Data Structures', 'Algorithms'], 2));
\`\`\`

Feel free to paste your API Key to enable live Gemini API streaming!`;

    const words = mockReply.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield (i === 0 ? '' : ' ') + words[i];
      await new Promise((res) => setTimeout(res, 25));
    }
    return;
  }

  const endpoint = `${GEMINI_API_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const payload = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: config.temperature ?? 0.7,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error?.message || `Gemini API returned status ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by response body.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete trailing line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.substring(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk =
              parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textChunk) {
              yield textChunk;
            }
          } catch {
            // Ignore parse errors on partial SSE JSON lines
          }
        }
      }
    }

    // Process leftover buffer
    if (buffer.trim().startsWith('data: ')) {
      const jsonStr = buffer.trim().substring(6).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (textChunk) {
          yield textChunk;
        }
      } catch {
        // ignore
      }
    }
  } catch (err: any) {
    throw new Error(err.message || 'Failed to stream response from Gemini API.');
  }
}
