
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseNaturalLanguageTask = async (input: string, referenceDate: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following task description and convert it into a structured JSON object. 
    Current reference date is ${referenceDate}. 
    Support multi-day tasks (ranges) and specific time durations. 
    If a task spans multiple days, provide an 'endDate'. 
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
        required: ['title', 'date', 'priority']
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};
