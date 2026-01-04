
import { GoogleGenAI, Type } from "@google/genai";
import { BirthData, FullAnalysisResponse } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

/**
 * Performs a comprehensive cosmic compatibility analysis.
 * Uses deterministic logic for calculations and Gemini for emotional phrasing.
 */
export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData): Promise<FullAnalysisResponse> => {
  // Ensure process.env is accessible in module scope
  const env = (window as any).process?.env || {};
  const apiKey = env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is not configured in environment.");
  }

  // 1. Calculate deterministic data first (PRD Requirement: AI does not calculate logic)
  const personA_HD = getMockHDData(aData.date);
  const personB_HD = getMockHDData(bData.date);
  const shioA = getShio(aData.date);
  const shioB = getShio(bData.date);

  const personA = {
    name: aData.name,
    ...personA_HD,
    sunSign: getZodiacSign(aData.date),
    moonSign: "Calculating...", // Simple fallback as moon requires complex math
    shio: shioA.animal,
    element: shioA.element
  };

  const personB = {
    name: bData.name,
    ...personB_HD,
    sunSign: getZodiacSign(bData.date),
    moonSign: "Calculating...",
    shio: shioB.animal,
    element: shioB.element
  };

  const baseComp = calculateCompatibility(personA, personB);

  // 2. Use Gemini for Emotional Interpretation
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Generate a concise, emotionally intelligent relationship insight (summary) for two people based on this compatibility data:
    
    Person A: ${personA.name} (${personA.hdType}, ${personA.hdProfile}, ${personA.hdAuthority}, Sun Sign: ${personA.sunSign}, Chinese Zodiac: ${personA.shio})
    Person B: ${personB.name} (${personB.hdType}, ${personB.hdProfile}, ${personB.hdAuthority}, Sun Sign: ${personB.sunSign}, Chinese Zodiac: ${personB.shio})
    
    Deterministic Compatibility Results:
    Score: ${baseComp.score}/100
    Archetype: ${baseComp.archetype}
    Headline: ${baseComp.headline}
    Strengths: ${baseComp.strengths.join(', ')}
    Challenges: ${baseComp.challenges.join(', ')}

    Instruction: Write a 2-3 sentence "Emotional Tone Summary". 
    Avoid spiritual jargon. Use grounded, warm, and human language. Focus on growth and dynamics.
    Return ONLY a JSON object matching the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotionalSummary: { type: Type.STRING },
            refinedMoonSignA: { type: Type.STRING },
            refinedMoonSignB: { type: Type.STRING }
          },
          required: ["emotionalSummary", "refinedMoonSignA", "refinedMoonSignB"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      personA: { ...personA, moonSign: result.refinedMoonSignA || "Cosmic" },
      personB: { ...personB, moonSign: result.refinedMoonSignB || "Cosmic" },
      compatibility: {
        ...baseComp,
        summary: result.emotionalSummary || "A unique cosmic connection based on shared energy signatures."
      }
    };
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    // Fallback to deterministic results if AI fails
    return {
      personA,
      personB,
      compatibility: {
        ...baseComp,
        summary: `The connection between ${personA.name} and ${personB.name} is a ${baseComp.archetype} dynamic with a score of ${baseComp.score}%. You both bring unique strengths to the partnership.`
      }
    };
  }
};
