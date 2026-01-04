
import { PersonData, CompatibilityResult, HDType, HDAuthority } from '../types';

// Helper: Get Zodiac Sign
export const getZodiacSign = (dateStr: string) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Helper: Get Chinese Zodiac (Shio)
export const getShio = (dateStr: string) => {
  if (!dateStr) return { animal: "Unknown", element: "Unknown" };
  const year = new Date(dateStr).getFullYear();
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const elements = ["Metal", "Water", "Wood", "Fire", "Earth"];
  
  // Use positive modulo for safe indexing
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor((((year - 4) % 10 + 10) % 10) / 2);
  
  const animal = animals[animalIndex];
  const element = elements[elementIndex];
  return { animal, element };
};

// Simplified HD Calculation Mock (Deterministic as per PRD)
// In a real app, this would use ephemeris data.
export const getMockHDData = (dateStr: string) => {
  const d = new Date(dateStr).getTime();
  const types = Object.values(HDType);
  const authorities = Object.values(HDAuthority);
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2'];
  
  return {
    hdType: types[d % types.length],
    hdAuthority: authorities[d % authorities.length],
    hdProfile: profiles[d % profiles.length]
  };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary?: string } => {
  let score = 65; 
  let archetype = "Dynamic Duo";
  let headline = "Beautiful Alignment";
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  const pair = [a.hdType, b.hdType].sort().join(' x ');
  
  if (pair.includes('Generator') && pair.includes('Projector')) {
    score += 20;
    archetype = "The Guide & The Engine";
    headline = "Organic Flow";
    strengths.push("Clear direction", "Sustainable productivity");
  } else if (a.hdType === b.hdType) {
    score += 15;
    archetype = "Soul Mirrors";
    headline = "Deep Recognition";
    strengths.push("Shared understanding", "Similar life pace");
  } else if (pair.includes('Manifestor')) {
    score -= 5;
    archetype = "Power House";
    headline = "Intense Impact";
    challenges.push("Need for autonomy", "Communication gaps");
  }

  if (a.hdAuthority === b.hdAuthority) {
    score += 10;
    strengths.push("Harmonious decision making");
  } else if (a.hdAuthority.includes('Emotional') || b.hdAuthority.includes('Emotional')) {
    challenges.push("Different emotional waves");
  }

  if (a.hdProfile === b.hdProfile) {
    score += 10;
    strengths.push("Identical world view");
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    headline,
    archetype,
    strengths: strengths.length ? strengths : ["Mutual respect", "Shared growth"],
    challenges: challenges.length ? challenges : ["Minor communication nuances"],
    advice: "Respect each other's unique energy signature."
  };
};
