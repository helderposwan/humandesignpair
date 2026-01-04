
export interface BirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location?: string;
}

export interface CosmicProfile {
  name: string;
  hdType: string;
  hdAuthority: string;
  hdProfile: string;
  sunSign: string;
  moonSign: string;
  shio: string;
  element: string;
  careerPath: string; // New: Best career path
}

export interface CompatibilityAnalysis {
  score: number;
  headline: string;
  archetype: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  communicationAdvice: string; // New: Communication style advice
}

export interface FullAnalysisResponse {
  personA: CosmicProfile;
  personB: CosmicProfile;
  compatibility: CompatibilityAnalysis;
}

// Added missing Human Design enums used by constants.ts and compatibilityEngine.ts
export enum HDType {
  Generator = 'Generator',
  ManifestingGenerator = 'Manifesting Generator',
  Manifestor = 'Manifestor',
  Projector = 'Projector',
  Reflector = 'Reflector'
}

export enum HDAuthority {
  Emotional = 'Emotional',
  Sacral = 'Sacral',
  Splenic = 'Splenic',
  Ego = 'Ego',
  SelfProjected = 'Self Projected',
  Environmental = 'Environmental',
  Lunar = 'Lunar'
}

export enum HDProfile {
  P1_3 = '1/3',
  P1_4 = '1/4',
  P2_4 = '2/4',
  P2_5 = '2/5',
  P3_5 = '3/5',
  P3_6 = '3/6',
  P4_6 = '4/6',
  P4_1 = '4/1',
  P5_1 = '5/1',
  P5_2 = '5/2',
  P6_2 = '6/2',
  P6_3 = '6/3'
}

// Added missing interfaces for the local compatibility engine
export interface PersonData {
  type: HDType;
  authority: HDAuthority;
  profile: string;
}

export interface CompatibilityResult {
  score: number;
  headline: string;
  archetype: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  communicationAdvice?: string;
}
