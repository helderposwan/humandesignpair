
import { PersonData, CompatibilityResult, HDType, HDAuthority } from '../types';

// Helper: Get Zodiac Sign (Translated)
export const getZodiacSign = (dateStr: string) => {
  if (!dateStr) return "Tidak Diketahui";
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
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagitarius";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Kaprikornus";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Akuarius";
  return "Pisces";
};

// Helper: Get Chinese Zodiac (Shio) (Translated)
export const getShio = (dateStr: string) => {
  if (!dateStr) return { animal: "Tidak Diketahui", element: "Tidak Diketahui" };
  const year = new Date(dateStr).getFullYear();
  const animals = ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];
  const elements = ["Logam", "Air", "Kayu", "Api", "Tanah"];
  
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor((((year - 4) % 10 + 10) % 10) / 2);
  
  const animal = animals[animalIndex];
  const element = elements[elementIndex];
  return { animal, element };
};

// Mock HD Translation Map
export const translateHDType = (type: string): string => {
  const map: Record<string, string> = {
    [HDType.Generator]: 'Generator',
    [HDType.ManifestingGenerator]: 'Generator Manifesting',
    [HDType.Manifestor]: 'Manifestor',
    [HDType.Projector]: 'Proyektor',
    [HDType.Reflector]: 'Reflektor'
  };
  return map[type] || type;
};

export const translateHDAuthority = (auth: string): string => {
  const map: Record<string, string> = {
    [HDAuthority.Emotional]: 'Emosional',
    [HDAuthority.Sacral]: 'Sakral',
    [HDAuthority.Splenic]: 'Splenik',
    [HDAuthority.Ego]: 'Ego',
    [HDAuthority.SelfProjected]: 'Proyeksi Diri',
    [HDAuthority.Environmental]: 'Lingkungan',
    [HDAuthority.Lunar]: 'Lunar'
  };
  return map[auth] || auth;
};

// Simplified HD Calculation Mock
export const getMockHDData = (dateStr: string) => {
  const d = new Date(dateStr).getTime();
  const types = Object.values(HDType);
  const authorities = Object.values(HDAuthority);
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2'];
  
  const rawType = types[d % types.length];
  const rawAuth = authorities[d % authorities.length];

  return {
    hdType: translateHDType(rawType),
    hdAuthority: translateHDAuthority(rawAuth),
    hdProfile: profiles[d % profiles.length]
  };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary?: string } => {
  let score = 65; 
  let archetype = "Pasangan Dinamis";
  let headline = "Keselarasan yang Indah";
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  // Logic remains the same, but outputs translated
  const typeA = a.hdType;
  const typeB = b.hdType;
  
  if ((typeA.includes('Generator') && typeB.includes('Proyektor')) || (typeB.includes('Generator') && typeA.includes('Proyektor'))) {
    score += 20;
    archetype = "Sang Pemandu & Sang Penggerak";
    headline = "Aliran Organik";
    strengths.push("Arah yang jelas", "Produktivitas berkelanjutan");
  } else if (typeA === typeB) {
    score += 15;
    archetype = "Cermin Jiwa";
    headline = "Pengenalan Mendalam";
    strengths.push("Saling mengerti tanpa kata", "Ritme hidup yang serupa");
  } else if (typeA.includes('Manifestor') || typeB.includes('Manifestor')) {
    score -= 5;
    archetype = "Kekuatan Penggerak";
    headline = "Dampak Intens";
    challenges.push("Kebutuhan akan otonomi", "Celah komunikasi");
  }

  if (a.hdAuthority === b.hdAuthority) {
    score += 10;
    strengths.push("Pengambilan keputusan yang harmonis");
  } else if (a.hdAuthority.includes('Emosional') || b.hdAuthority.includes('Emosional')) {
    challenges.push("Gelombang emosional yang berbeda");
  }

  if (a.hdProfile === b.hdProfile) {
    score += 10;
    strengths.push("Pandangan dunia yang identik");
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    headline,
    archetype,
    strengths: strengths.length ? strengths : ["Saling menghormati", "Pertumbuhan bersama"],
    challenges: challenges.length ? challenges : ["Nuansa komunikasi kecil"],
    advice: "Hargai tanda energi unik satu sama lain."
  };
};
