
import { PersonData, CompatibilityResult, HDType, HDAuthority } from '../types';

export const calculateCompatibility = (a: PersonData, b: PersonData): CompatibilityResult => {
  let score = 60; // Baseline
  let headline = "Balanced Dynamic";
  let archetype = "Collaborators";
  const strengths: string[] = [];
  const challenges: string[] = [];
  let advice = "";

  // 1. Type Compatibility
  const types = [a.type, b.type].sort();
  const pair = types.join(' x ');

  if (pair === `${HDType.Generator} x ${HDType.ManifestingGenerator}`) {
    score += 30;
    headline = "High Synergy Energy";
    archetype = "The Power Couple";
    strengths.push("Shared life force energy", "Incredible productivity together");
    advice = "Ensure you both wait for something to respond to before jumping in.";
  } else if (a.type === HDType.Projector || b.type === HDType.Projector) {
    if (a.type === HDType.Generator || b.type === HDType.Generator || a.type === HDType.ManifestingGenerator || b.type === HDType.ManifestingGenerator) {
      score += 25;
      headline = "Guidance & Energy Exchange";
      archetype = "The Guide & The Engine";
      strengths.push("Clear direction", "Sustainable effort");
      advice = "Generator should invite the Projector's guidance rather than resisting it.";
    }
  } else if (a.type === HDType.Manifestor && b.type === HDType.Manifestor) {
    score -= 20;
    headline = "High Impact, High Autonomy";
    archetype = "The Twin Flames";
    strengths.push("Deep mutual respect for freedom", "Pure creative power");
    challenges.push("Power struggles", "Lack of communication");
    advice = "Inform each other of your moves to avoid unnecessary friction.";
  } else if (a.type === HDType.Reflector || b.type === HDType.Reflector) {
    score += 10;
    headline = "The Mirror Dynamic";
    archetype = "The Wisdom Seekers";
    strengths.push("Reflective growth", "Heightened awareness");
    challenges.push("Absorbing each other's stress");
    advice = "Ensure the Reflector has plenty of alone time to clear their energy.";
  }

  // 2. Authority Dynamics
  if (a.authority === b.authority) {
    score += 10;
    strengths.push("Aligned decision-making timing");
  } else if (
    (a.authority === HDAuthority.Emotional && b.authority !== HDAuthority.Emotional) ||
    (b.authority === HDAuthority.Emotional && a.authority !== HDAuthority.Emotional)
  ) {
    score -= 10;
    challenges.push("Timing friction in big decisions");
    advice = "The non-emotional partner needs to give the emotional partner space to ride their wave.";
  }

  // 3. Profile Chemistry
  const aLines = a.profile.split('/');
  const bLines = b.profile.split('/');
  const commonLines = aLines.filter(line => bLines.includes(line));
  
  if (commonLines.length > 0) {
    score += 5 * commonLines.length;
    strengths.push("Shared foundational perspective");
  }

  // Final Clamping & Safety
  score = Math.min(100, Math.max(0, score));
  
  if (strengths.length === 0) strengths.push("Mutual curiosity", "Authentic connection");
  if (challenges.length === 0) challenges.push("Understanding subtle differences");
  if (!advice) advice = "Focus on honoring each other's unique strategy and authority.";

  return {
    score,
    headline,
    archetype,
    strengths,
    challenges,
    advice
  };
};
