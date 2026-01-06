import { GoogleGenAI } from "@google/genai";
import { DATA } from '../constants';

const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${DATA.personal.firstName} ${DATA.personal.lastName}'s portfolio website. 
Your goal is to answer visitor questions about ${DATA.personal.firstName} ${DATA.personal.lastName} based STRICTLY on the provided context data.
Be professional, concise, and friendly. 
Do not make up facts. If the answer isn't in the data, suggest they email ${DATA.personal.email}.

Context Data:
${JSON.stringify(DATA, null, 2)}
`;

// Safely retrieve API Key without crashing in browser
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return "";
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "I'm currently offline (API Key missing). Please contact me directly via email for inquiries.";
  }

  try {
    // Initialize the client lazily to prevent top-level crashes
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I ran into a technical issue. Please try again later.";
  }
};