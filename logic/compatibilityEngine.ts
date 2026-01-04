
import { PersonData, CompatibilityResult, HDType, HDAuthority } from '../types';

// Helper: Get Zodiac Sign
export const getZodiacSign = (dateStr: string) => {
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
  const year = new Date(dateStr).getFullYear();
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const elements = ["Metal", "Water", "Wood", "Fire", "Earth"];
  
  const animal = animals[(year - 4) % 12];
  const element = elements[Math.floor(((year - 4) % 10) / 2)];
  return { animal, element };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary: string } => {
  let score = 65; // Start with decent baseline
  let archetype = "Dynamic Duo";
  let headline = "Beautiful Alignment";
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  // Logic 1: HD Type Synergy
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

  // Logic 2: Authority
  if (a.hdAuthority === b.hdAuthority) {
    score += 10;
    strengths.push("Harmonious decision making");
  } else if (a.hdAuthority.includes('Emotional') || b.hdAuthority.includes('Emotional')) {
    challenges.push("Different emotional waves");
  }

  // Logic 3: Profiles
  if (a.hdProfile === b.hdProfile) {
    score += 10;
    strengths.push("Identical world view");
  }

  // Generate a human-like summary locally
  const summary = `Connection between ${a.name} and ${b.name} is defined by ${headline.toLowerCase()}. With a compatibility score of ${score}%, you both bring a unique ${archetype} dynamic to the table. ${a.name}'s ${a.hdType} nature complements ${b.name}'s ${b.hdType} energy. Focus on honoring your individual strategies to thrive.`;

  return {
    score: Math.min(100, Math.max(0, score)),
    headline,
    archetype,
    strengths,
    challenges: challenges.length ? challenges : ["Minor communication nuances"],
    advice: "Respect each other's unique energy signature.",
    summary
  };
};
