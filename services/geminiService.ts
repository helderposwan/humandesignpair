
import { GoogleGenAI, Type } from "@google/genai";
import { BirthData, FullAnalysisResponse } from "../types.ts";

/**
 * Performs a comprehensive cosmic compatibility analysis using Gemini 3 Flash
 */
export const getFullCosmicAnalysis = async (a: BirthData, b: BirthData): Promise<FullAnalysisResponse> => {
  // Obtain API key exclusively from process.env
  // Check for common naming variations
  const apiKey = process.env.API_KEY || (process.env as any).API_Key || (process.env as any).api_key;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API_KEY is missing. Harap lakukan 'Retry Deployment' di dashboard Cloudflare.");
  }

  // Create instance right before making the call
  const ai = new GoogleGenAI({ apiKey: apiKey as string });
  
  const prompt = `
    Analyze the birth details of two people and provide a detailed Human Design and Astrological compatibility report.
    
    Person A: Name: ${a.name}, Born: ${a.date} at ${a.time} (Location: ${a.location || 'Unknown'})
    Person B: Name: ${b.name}, Born: ${b.date} at ${b.time} (Location: ${b.location || 'Unknown'})

    Calculate:
    1. Human Design: Type, Inner Authority, and Profile.
    2. Western Astrology: Sun Sign and Moon Sign.
    3. Chinese Zodiac (Shio): Animal and Element.
    4. Compatibility: A score (0-100), a headline, an archetype, and a detailed relationship summary.

    Be emotionally intelligent, grounded, and insightful. Avoid heavy spiritual jargon. Use the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personA: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hdType: { type: Type.STRING },
                hdAuthority: { type: Type.STRING },
                hdProfile: { type: Type.STRING },
                sunSign: { type: Type.STRING },
                moonSign: { type: Type.STRING },
                shio: { type: Type.STRING },
                element: { type: Type.STRING },
              },
              required: ["name", "hdType", "hdAuthority", "hdProfile", "sunSign", "moonSign", "shio", "element"]
            },
            personB: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hdType: { type: Type.STRING },
                hdAuthority: { type: Type.STRING },
                hdProfile: { type: Type.STRING },
                sunSign: { type: Type.STRING },
                moonSign: { type: Type.STRING },
                shio: { type: Type.STRING },
                element: { type: Type.STRING },
              },
              required: ["name", "hdType", "hdAuthority", "hdProfile", "sunSign", "moonSign", "shio", "element"]
            },
            compatibility: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                headline: { type: Type.STRING },
                archetype: { type: Type.STRING },
                summary: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["score", "headline", "archetype", "summary", "strengths", "challenges"]
            }
          },
          required: ["personA", "personB", "compatibility"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI model.");
    }

    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
