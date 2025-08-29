import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'mixtral-8x7b-32768';

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const executeWithGroq = async (
  code: string,
  language: string,
  testCase: string,
  functionName: string
): Promise<{ result: string; error?: string }> => {
  try {
    const prompt = `You are a code execution assistant. Execute the following ${language} code with the given test case.
    
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Test Case: ${testCase}
    
    Call the function \`${functionName}(${testCase})\` and return ONLY the raw output as a string. 
    If there are any errors, return them as a string starting with "Error: ".
    `;

    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that executes code and returns the output.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GENAI_API_KEY}`
        }
      }
    );

    const result = response.data.choices[0]?.message?.content || '';
    return { result };
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      result: '',
      error: error instanceof Error 
        ? `Error executing code: ${error.message}` 
        : 'Unknown error occurred while executing code'
    };
  }
};
