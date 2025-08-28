import axios, { AxiosError } from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'gemma2-9b-it';

// Create axios instance with default config
// Debug log to check if env variable is loaded
console.log('API Key:', import.meta.env.VITE_GENAI_API_KEY ? 'Loaded' : 'Not loaded');

const groqApi = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_GENAI_API_KEY}`,
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
groqApi.interceptors.request.use(request => {
  const debugInfo = {
    url: request.url,
    method: request.method,
    headers: {
      'Content-Type': request.headers['Content-Type'],
      'Authorization': request.headers['Authorization'] ? 'Bearer [REDACTED]' : 'Not set'
    },
    data: request.data
  };
  console.log('API Request:', JSON.stringify(debugInfo, null, 2));
  return request;
});

// Add response interceptor for better error handling
groqApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
    } else if (error.request) {
      console.error('API Request Error:', {
        message: 'No response received',
        request: error.request
      });
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const getGroqResponse = async (messages: Message[]) => {
  console.log('Preparing to send messages to Groq:', JSON.stringify(messages, null, 2));
  
  try {
    const requestData = {
      model: MODEL,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    };

    console.log('Sending request to Groq API with data:', JSON.stringify(requestData, null, 2));
    
    const response = await groqApi.post('/chat/completions', requestData);
    
    console.log('Received response from Groq API:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (!response.data?.choices?.[0]?.message?.content) {
      console.error('Unexpected API response format:', response.data);
      throw new Error('Invalid response format from Groq API');
    }
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Groq API Error Response:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
        headers: axiosError.response.headers
      });
      
      if (axiosError.response.status === 400) {
        throw new Error('Invalid request to AI service. Please check your input.');
      } else if (axiosError.response.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (axiosError.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`AI service error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('No response from Groq API:', axiosError.request);
      throw new Error('No response from AI service. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Groq API setup error:', axiosError.message);
      throw new Error(`Failed to process AI request: ${axiosError.message}`);
    }
  }
};

export const getHintFromAI = async (attempt: number, previousHints: string[]) => {
  const systemPrompt = `You are a helpful AI assistant providing hints for a machine learning challenge. 
  The user is trying to guess a specific term related to machine learning training. 
  The term is "epoch".
  
  Guidelines:
  - Be helpful but don't reveal the answer directly
  - Make the hints progressively more specific based on attempt number
  - Consider the user's attempt number (${attempt})
  - Don't repeat previous hints: ${previousHints.join(', ')}
  - Keep responses concise (1-2 sentences)
  - Focus on the concept of a complete pass through training data`;

  const userPrompt = `Provide a hint for attempt ${attempt}. ` +
    `Previous hints given: ${previousHints.join(', ') || 'None'}`;

  return getGroqResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);
};

export const validateAnswer = async (userAnswer: string) => {
  // Check for greetings first
  const lowerAnswer = userAnswer.toLowerCase().trim();
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'howdy'];
  
  if (greetings.some(greeting => lowerAnswer.includes(greeting))) {
    return {
      isCorrect: false,
      feedback: "Hello there, young wizard! Welcome to the Triwizard Tournament of Machine Learning! 🧙‍♂️✨ The first challenge is to guess the magical term I'm thinking of. It's a term used in training machine learning models. What's your guess?",
      isClose: false
    };
  }

  const systemPrompt = `You are the Sorting Hat at Hogwarts, but for machine learning terms!
  The correct term is "epoch".
  
  Your task is to evaluate if the student's answer is correct in a magical, encouraging way.
  Consider variations, common misspellings, and related terms.
  
  Rules for evaluation:
  - An answer is correct if it's exactly "epoch" (case insensitive)
  - An answer is close if it's a common variation like "epoc", "epock", or related terms like "training cycle"
  - For incorrect answers, provide a magical hint without revealing the answer
  - Keep responses brief and in the style of a Hogwarts professor
  
  Respond with a valid JSON object containing only these exact fields:
  {
    "isCorrect": boolean,
    "feedback": "string (magical, encouraging feedback)",
    "isClose": boolean
  }
  
  Example response: {"isCorrect": false, "feedback": "Hmm, not quite, but you're on the right broomstick! Think about how many times the model sees the entire training data. What might that be called?", "isClose": true}`;

  // Ensure the user answer is properly escaped for JSON
  const safeUserAnswer = userAnswer.replace(/"/g, '\\"');
  
  const response = await getGroqResponse([
    { 
      role: 'system', 
      content: systemPrompt + '\n\nRemember to respond with valid JSON only.'
    },
    { 
      role: 'user', 
      content: `Is "${safeUserAnswer}" the correct term?` 
    }
  ]);

  try {
    // Try to parse as raw JSON first
    try {
      return JSON.parse(response);
    } catch (jsonError) {
      // If that fails, try to extract JSON from markdown code block
      const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1].trim());
      }
      // If no code block found, try to find JSON in the response
      const jsonStringMatch = response.match(/\{[\s\S]*\}/);
      if (jsonStringMatch) {
        return JSON.parse(jsonStringMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    }
  } catch (e) {
    console.error('Failed to parse AI response. Response was:', response);
    console.error('Error details:', e);
    return {
      isCorrect: false,
      feedback: 'Error processing your answer. The AI response format was unexpected.',
      isClose: false
    };
  }
};
