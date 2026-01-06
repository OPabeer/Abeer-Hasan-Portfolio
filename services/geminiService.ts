import { GoogleGenAI } from "@google/genai";
import { DATA } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${DATA.personal.firstName} ${DATA.personal.lastName}'s portfolio website. 
Your goal is to answer visitor questions about ${DATA.personal.firstName} ${DATA.personal.lastName} based STRICTLY on the provided context data.
Be professional, concise, and friendly. 
Do not make up facts. If the answer isn't in the data, suggest they email ${DATA.personal.email}.

Context Data:
${JSON.stringify(DATA, null, 2)}
`;

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
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