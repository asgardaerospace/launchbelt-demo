
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always initialize with process.env.API_KEY directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTDP = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this technical work package description for manufacturing risks and missing compliance documentation: ${description}`,
      config: {
        systemInstruction: "You are a senior aerospace manufacturing engineer. Provide a concise JSON analysis.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingDocs: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedLeadTimeWeeks: { type: Type.NUMBER }
          },
          required: ["risks", "missingDocs", "estimatedLeadTimeWeeks"]
        }
      }
    });
    // Fix: Access .text as a property, not a method, and ensure it's trimmed if needed.
    const jsonStr = (response.text || '{}').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const summarizeQuotes = async (quotes: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compare these supplier quotes and recommend the best option based on lead time and quality score: ${JSON.stringify(quotes)}`,
      config: {
        systemInstruction: "You are a procurement lead. Analyze cost, schedule, and technical risk."
      }
    });
    // Fix: Access .text as a property directly.
    return response.text;
  } catch (error) {
    console.error("Gemini Quote Summary Error:", error);
    return "Failed to analyze quotes.";
  }
};
