// Using fetch directly to avoid requiring the official openai Node.js SDK
// which can sometimes have issues in browser-only environments without polyfills.
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getOpenAIResponse = async (messagesArray, apiKey, mode = 'medical', onUpdate = null) => {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  // Map messages to OpenAI format
  const formattedMessages = messagesArray.map(msg => {
    if (msg.role === 'user' && msg.images && msg.images.length > 0) {
      // Vision request
      const content = [
        { type: 'text', text: msg.content || 'Analyze this medical document/image.' }
      ];
      
      msg.images.forEach(imgBase64 => {
        content.push({
          type: 'image_url',
          image_url: {
            url: imgBase64,
          }
        });
      });

      return {
        role: msg.role,
        content: content
      };
    } else {
      return {
        role: msg.role,
        content: msg.content
      };
    }
  });

  const body = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: mode === 'medical' 
          ? 'You are Vanni, a friendly, conversational, and highly knowledgeable medical coding AI assistant acting as an expert Optum Pro encoder. You rigorously cross-check multiple CPT codes for NCCI (National Correct Coding Initiative) edits (e.g., Column 1/Column 2 conflicts, modifier indicators) and strongly alert the user of bundling issues. You meticulously check for any \'Excludes1\' or \'Excludes2\' notes when multiple ICD-10-CM codes are used together. Provide HIGHLY DETAILED and comprehensive explanations. Whenever you provide facts, rules, or medical codes, you MUST ALWAYS include citations or references to official guidelines (e.g., AMA CPT Guidelines, CMS Medicare Manual, WHO ICD-10 CM Guidelines). Format your responses beautifully using markdown with bold headings and structured lists.'
          : 'You are Vanni, a friendly and highly capable general AI assistant. You converse naturally and engagingly with the user, just like ChatGPT. You remember context from prior messages perfectly to answer follow-up questions seamlessly. Provide HIGHLY DETAILED, thorough, accurate, and comprehensive answers to any questions they have. Whenever you state facts or provide data, ALWAYS include clear citations or name the sources of your information. Format your responses beautifully in markdown with structured sections.'
      },
      ...formattedMessages
    ],
    max_tokens: 3000,
    temperature: mode === 'medical' ? 0.2 : 0.7,
    stream: true,
  };

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch response from OpenAI');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let fullContent = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunkString = decoder.decode(value, { stream: true });
      const lines = chunkString.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
              const textChunk = data.choices[0].delta.content;
              fullContent += textChunk;
              if (onUpdate) onUpdate(textChunk);
            }
          } catch (e) {
            console.error('Error parsing stream chunk', e);
          }
        }
      }
    }
  }

  return fullContent;
};
