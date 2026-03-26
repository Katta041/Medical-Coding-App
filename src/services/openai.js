// Using fetch directly to avoid requiring the official openai Node.js SDK
// which can sometimes have issues in browser-only environments without polyfills.
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getOpenAIResponse = async (messagesArray, apiKey, mode = 'medical') => {
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
          ? 'You are Vanni, a friendly, conversational, and highly knowledgeable medical coding AI assistant. You engage naturally with users, just like a human expert, while helping them find accurate ICD-10, CPT, and HCPCS codes from their queries or documents. Always interpret context from previous messages to handle follow-up questions smoothly. Provide thorough explanations, act with empathy, and format your responses beautifully using markdown.'
          : 'You are Vanni, a friendly and highly capable general AI assistant. You converse naturally and engagingly with the user, just like ChatGPT. You remember context from prior messages perfectly to answer follow-up questions seamlessly. Provide thorough, accurate, and helpful answers to any questions they have, while formatting your responses in markdown.'
      },
      ...formattedMessages
    ],
    max_tokens: 1500,
    temperature: 0.7,
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
