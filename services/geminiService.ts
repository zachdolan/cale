
import { GoogleGenAI, Type } from "@google/genai";

// Safe access to API Key
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
};

export const parseNaturalLanguageTask = async (input: string, referenceDate: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Natural language parsing will not work.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following task description and convert it into a structured JSON object. 
    Current reference date is ${referenceDate}. 
    Support multi-day tasks (ranges) and specific time durations. 
    If a task spans multiple days, provide an 'endDate'. 
    Only assign a 'priority' (low, medium, high) if the user explicitly mentions words like "urgent", "important", "low priority", etc. If not mentioned, omit the priority field.
    Input: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Brief title of the task' },
          date: { type: Type.STRING, description: 'Start date in ISO format YYYY-MM-DD' },
          endDate: { type: Type.STRING, description: 'End date in ISO format YYYY-MM-DD if it spans multiple days' },
          startTime: { type: Type.STRING, description: '24h format HH:mm' },
          endTime: { type: Type.STRING, description: '24h format HH:mm' },
          priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          description: { type: Type.STRING },
          category: { type: Type.STRING }
        },
        required: ['title', 'date']
      }
    }
  });

  try {
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};
