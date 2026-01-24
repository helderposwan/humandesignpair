
import { CompatibilityResult, HDType, HDAuthority, Language } from '../types';

const normalize = (str: string = "") => str.toLowerCase().trim();

const getDetailedHash = (dateStr: string, timeStr: string, name: string, location: string = ""): number => {
  const [hours, minutes] = timeStr.split(':').map(s => s.padStart(2, '0'));
  const normalizedTime = `${hours}:${minutes}`;
  const combined = `${normalize(dateStr)}|${normalizedTime}|${normalize(name)}|${normalize(location)}`;
  
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getZodiacSign = (dateStr: string, lang: Language = 'id') => {
  if (!dateStr) return lang === 'id' ? "Tidak Diketahui" : "Unknown";
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Zodiac names are generally same in ID/EN, but let's be safe
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius"; // EN spelling standard
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return lang === 'id' ? "Kaprikornus" : "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return lang === 'id' ? "Akuarius" : "Aquarius";
  return "Pisces";
};

export const getShio = (dateStr: string, lang: Language = 'id') => {
  if (!dateStr) return { animal: lang === 'id' ? "Tidak Diketahui" : "Unknown", element: lang === 'id' ? "Tidak Diketahui" : "Unknown" };
  const year = new Date(dateStr).getFullYear();
  
  const animalsId = ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];
  const animalsEn = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  
  const elementsId = ["Logam", "Air", "Kayu", "Api", "Tanah"];
  const elementsEn = ["Metal", "Water", "Wood", "Fire", "Earth"];

  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor((((year - 4) % 10 + 10) % 10) / 2);
  
  return { 
    animal: lang === 'id' ? animalsId[animalIndex] : animalsEn[animalIndex], 
    element: lang === 'id' ? elementsId[elementIndex] : elementsEn[elementIndex] 
  };
};

export const translateHDType = (type: HDType, lang: Language = 'id'): string => {
  // Types are standard English terms in HD usually, but let's keep it consistent
  return type; 
};

export const translateHDAuthority = (auth: string, lang: Language = 'id'): string => {
  if (lang === 'en') {
    // Return original enum value or English equivalent
    return auth; 
  }
  
  const map: Record<string, string> = {
    [HDAuthority.Emotional]: 'Emosional - Solar Plexus',
    [HDAuthority.Sacral]: 'Sakral',
    [HDAuthority.Splenic]: 'Splenic (Insting)',
    [HDAuthority.Ego]: 'Ego',
    [HDAuthority.SelfProjected]: 'Self Projected',
    [HDAuthority.Environmental]: 'Lingkungan',
    [HDAuthority.Lunar]: 'Lunar'
  };
  return map[auth] || auth;
};

const getStrategy = (type: string, lang: Language = 'id'): string => {
  if (lang === 'en') {
    if (type === 'Generator' || type === 'Manifesting Generator') return "To Respond";
    if (type === 'Projector') return "Wait for the Invitation";
    if (type === 'Manifestor') return "To Inform";
    if (type === 'Reflector') return "Wait a Lunar Cycle";
    return "Unknown";
  }

  if (type === 'Generator' || type === 'Manifesting Generator') return "Menunggu untuk Merespons";
  if (type === 'Projector') return "Menunggu Undangan";
  if (type === 'Manifestor') return "Menginformasikan";
  if (type === 'Reflector') return "Menunggu Siklus Lunar (28 Hari)";
  return "Tidak Diketahui";
};

const getNotSelfTheme = (type: string, lang: Language = 'id'): string => {
  if (lang === 'en') {
    if (type === 'Generator' || type === 'Manifesting Generator') return "Frustration";
    if (type === 'Projector') return "Bitterness";
    if (type === 'Manifestor') return "Anger";
    if (type === 'Reflector') return "Disappointment";
    return "Unknown";
  }

  if (type === 'Generator' || type === 'Manifesting Generator') return "Frustrasi";
  if (type === 'Projector') return "Kepahitan (Bitterness)";
  if (type === 'Manifestor') return "Kemarahan";
  if (type === 'Reflector') return "Kekecewaan";
  return "Tidak Diketahui";
};

export const getCommunicationStyle = (hdType: string, lang: Language = 'id'): string => {
  if (lang === 'en') {
     const styles: Record<string, string> = {
      'Generator': "Respond through body signals. Use Yes/No questions.",
      'Manifesting Generator': "Fast and pragmatic. Get straight to the action.",
      'Projector': "Needs recognition. Appreciate them before inviting them to speak.",
      'Manifestor': "Needs initial information. Inform before acting.",
      'Reflector': "Reflects environment. Give extra time for clarity."
    };
    return styles[hdType] || "Adaptive communication style.";
  }

  const styles: Record<string, string> = {
    'Generator': "Merespons melalui sinyal tubuh. Gunakan pertanyaan Ya/Tidak.",
    'Manifesting Generator': "Cepat dan pragmatis. Langsung ke intisari aksi.",
    'Projector': "Butuh pengakuan. Berikan apresiasi sebelum mengundang mereka bicara.",
    'Manifestor': "Butuh informasi awal. Beri tahu niat Anda sebelum bertindak.",
    'Reflector': "Refleksi lingkungan. Berikan waktu ekstra untuk proses kejernihan."
  };
  return styles[hdType] || "Gaya komunikasi adaptif.";
};

export const getMockHDData = (dateStr: string, timeStr: string, name: string, location: string = "", lang: Language = 'id') => {
  // Static Easter Eggs
  if (dateStr === "1995-05-23" && (timeStr === "04:32" || timeStr === "04:30")) {
    return {
      hdType: "Manifesting Generator",
      hdAuthority: translateHDAuthority("Sacral", lang),
      hdProfile: "2 / 4",
      hdStrategy: getStrategy("Manifesting Generator", lang),
      hdNotSelfTheme: getNotSelfTheme("Manifesting Generator", lang),
      hdDefinition: "Split Definition",
      hdIncarnationCross: "Right Angle Cross of The Sleeping Phoenix (20/34 | 55/59)",
      communicationStyle: getCommunicationStyle("Manifesting Generator", lang)
    };
  }

  if (dateStr === "1997-09-11" && (timeStr === "09:50" || timeStr === "09:51")) {
    return {
      hdType: "Manifesting Generator",
      hdAuthority: translateHDAuthority("Emotional", lang),
      hdProfile: "2 / 4",
      hdStrategy: getStrategy("Manifesting Generator", lang),
      hdNotSelfTheme: getNotSelfTheme("Manifesting Generator", lang),
      hdDefinition: "Single Definition",
      hdIncarnationCross: "Right Angle Cross of Rulership (47/22 | 45/26)",
      communicationStyle: getCommunicationStyle("Manifesting Generator", lang)
    };
  }

  const hash = getDetailedHash(dateStr, timeStr, name, location);
  const typeRoll = hash % 100;
  let rawType: HDType;
  
  if (typeRoll < 35) rawType = HDType.Generator;
  else if (typeRoll < 70) rawType = HDType.ManifestingGenerator;
  else if (typeRoll < 85) rawType = HDType.Projector;
  else if (typeRoll < 98) rawType = HDType.Manifestor;
  else rawType = HDType.Reflector;

  const authoritiesByType: Record<HDType, HDAuthority[]> = {
    [HDType.Generator]: [HDAuthority.Emotional, HDAuthority.Sacral],
    [HDType.ManifestingGenerator]: [HDAuthority.Emotional, HDAuthority.Sacral],
    [HDType.Projector]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego, HDAuthority.SelfProjected, HDAuthority.Environmental],
    [HDType.Manifestor]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego],
    [HDType.Reflector]: [HDAuthority.Lunar]
  };

  const possibleAuths = authoritiesByType[rawType];
  const authHash = (hash >> 3) ^ 0x12345678;
  const rawAuth = possibleAuths[Math.abs(authHash) % possibleAuths.length];
  
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
  const profileHash = (hash >> 7) ^ 0x87654321;
  const hdProfileRaw = profiles[Math.abs(profileHash) % profiles.length];
  const hdProfile = hdProfileRaw.split('/').join(' / ');
  
  const definitions = ["Single Definition", "Split Definition", "Triple Split Definition"];
  const hdDefinition = definitions[Math.abs(hash >> 11) % definitions.length];

  const crosses = [
    "Right Angle Cross of The Sleeping Phoenix (20/34 | 55/59)",
    "Right Angle Cross of Rulership (47/22 | 45/26)",
    "Right Angle Cross of Explanation (49/4 | 43/23)",
    "Right Angle Cross of Laws (3/50 | 60/56)"
  ];
  const hdIncarnationCross = crosses[Math.abs(hash >> 13) % crosses.length];

  const typeName = translateHDType(rawType, lang);

  return {
    hdType: typeName,
    hdAuthority: translateHDAuthority(rawAuth, lang),
    hdProfile,
    hdStrategy: getStrategy(typeName, lang),
    hdNotSelfTheme: getNotSelfTheme(typeName, lang),
    hdDefinition,
    hdIncarnationCross,
    communicationStyle: getCommunicationStyle(typeName, lang)
  };
};

export const calculateCompatibility = (a: any, b: any, lang: Language = 'id'): CompatibilityResult & { summary?: string, communicationAdvice: string } => {
  // BASE SCORE starts low (30) to allow for wide variance based on mechanics
  let score = 30; 
  const strengths: string[] = [];
  const challenges: string[] = [];

  const typeA = a.hdType;
  const typeB = b.hdType;
  const combination = [typeA, typeB].sort().join(' & ');

  // MECHANICS-BASED TYPE SCORING
  // Structure: Key -> { s: score, arch: {id, en}, head: {id, en}, s1: {id, en}, c1: {id, en} }
  const typeResonance: Record<string, {
    s: number, 
    arch: {id: string, en: string}, 
    head: {id: string, en: string}, 
    s1: {id: string, en: string}, 
    c1: {id: string, en: string}
  }> = {
    'Generator & Projector': { 
      s: 55, 
      arch: { id: "Pembangkit Tenaga Terpandu", en: "Guided Powerhouse" }, 
      head: { id: "Keseimbangan Visi dan Eksekusi", en: "Balance of Vision and Execution" },
      s1: { id: "Projector mengarahkan energi sakral Generator secara efisien", en: "Projector guides the Generator's sacral energy efficiently" }, 
      c1: { id: "Projector bisa merasa lelah jika memaksakan ritme Generator", en: "Projector risks burnout trying to match Generator's rhythm" }
    },
    'Manifesting Generator & Projector': { 
      s: 58, 
      arch: { id: "Visioner Efisien", en: "Efficient Visionary" }, 
      head: { id: "Kombinasi Strategi dan Kecepatan", en: "Strategy Meets Velocity" },
      s1: { id: "Sinergi antara visi tajam dan eksekusi kilat", en: "Synergy between sharp vision and rapid execution" }, 
      c1: { id: "Ketimpangan level energi yang signifikan", en: "Significant energy level mismatch" }
    },
    'Generator & Generator': { 
      s: 50, 
      arch: { id: "Motor Kolektif", en: "Collective Motor" }, 
      head: { id: "Harmoni Kerja Berkelanjutan", en: "Sustainable Work Harmony" },
      s1: { id: "Dua sumber energi yang saling menguatkan", en: "Two energy sources reinforcing each other" }, 
      c1: { id: "Risiko 'stuck' bersama jika tidak memiliki tujuan jelas", en: "Risk of getting 'stuck' together without clear direction" }
    },
    'Manifesting Generator & Manifesting Generator': {
      s: 52, 
      arch: { id: "Pasangan Frekuensi Tinggi", en: "High Frequency Pair" }, 
      head: { id: "Akselerasi Tanpa Batas", en: "Boundless Acceleration" },
      s1: { id: "Saling memahami kecepatan satu sama lain", en: "Mutual understanding of high speed" }, 
      c1: { id: "Komunikasi sering terburu-buru dan melewatkan detil", en: "Communication often rushed, missing details" }
    },
    'Manifestor & Generator': { 
      s: 40, 
      arch: { id: "Inisiator & Pembangun", en: "Initiator & Builder" }, 
      head: { id: "Dinamika Aksi Mandiri", en: "Dynamics of Independent Action" },
      s1: { id: "Kekuatan untuk memulai dan menyelesaikan", en: "Power to initiate and complete" }, 
      c1: { id: "Manifestor merasa dikontrol, Generator merasa diabaikan", en: "Manifestor feels controlled, Generator feels ignored" }
    },
    'Manifestor & Manifestor': { 
      s: 25, 
      arch: { id: "Jiwa Independen", en: "Independent Spirits" }, 
      head: { id: "Dua Kapten Satu Kapal", en: "Two Captains, One Ship" },
      s1: { id: "Respek tinggi atas kemandirian masing-masing", en: "High respect for mutual independence" }, 
      c1: { id: "Clash ego dan kesulitan dalam sinkronisasi niat", en: "Ego clash and difficulty in intent synchronization" }
    },
    'Projector & Projector': { 
      s: 30, 
      arch: { id: "Pemandu Non-Energi", en: "Non-Energy Guides" }, 
      head: { id: "Koneksi Intelektual Mendalam", en: "Deep Intellectual Connection" },
      s1: { id: "Saling mengenali dan menghargai nilai satu sama lain", en: "Mutual recognition and appreciation of value" }, 
      c1: { id: "Kurangnya 'motor' energi untuk mewujudkan ide menjadi aksi", en: "Lack of 'motor' energy to manifest ideas into action" }
    }
  };

  const defaultRes = { 
    s: 35, 
    arch: { id: "Pencari Jiwa", en: "Soul Seekers" }, 
    head: { id: "Eksplorasi Frekuensi Unik", en: "Unique Frequency Exploration" }, 
    s1: { id: "Sudut pandang yang saling melengkapi", en: "Complementary perspectives" }, 
    c1: { id: "Tantangan dalam menemukan ritme harian", en: "Challenge in finding daily rhythm" } 
  };

  const resonance = typeResonance[combination] || defaultRes;
  
  score += resonance.s;
  strengths.push(resonance.s1[lang]);
  challenges.push(resonance.c1[lang]);

  // PROFILE HARMONY (+/- 15 pts)
  const lineA = a.hdProfile.split(' / ')[0];
  const lineB = b.hdProfile.split(' / ')[0];
  if (lineA === lineB) {
    score += 15;
    strengths.push(lang === 'id' 
      ? `Harmoni Profil Garis ${lineA} yang sangat kuat` 
      : `Strong harmony in Line ${lineA} Profiles`);
  } else if ((lineA === '2' && lineB === '4') || (lineA === '4' && lineB === '2')) {
    score += 10;
    strengths.push(lang === 'id' 
      ? "Resonansi alami antara Hermit dan Opportunist" 
      : "Natural resonance between Hermit and Opportunist");
  } else {
    score -= 5;
    challenges.push(lang === 'id' 
      ? "Perbedaan perspektif fundamental dalam menjalani hidup" 
      : "Fundamental difference in life perspective");
  }

  // AUTHORITY ALIGNMENT (+/- 10 pts)
  const authA = a.hdAuthority;
  const authB = b.hdAuthority;
  
  // Need to check raw/translated strings. Since we translated inputs, we check based on content.
  const isEmotionalA = authA.toLowerCase().includes('emosional') || authA.toLowerCase().includes('emotional');
  const isEmotionalB = authB.toLowerCase().includes('emosional') || authB.toLowerCase().includes('emotional');

  if (isEmotionalA && isEmotionalB) {
    score -= 8;
    challenges.push(lang === 'id' 
      ? "Gelombang emosi ganda yang menuntut kesabaran tinggi" 
      : "Double emotional wave requiring high patience");
  } else if (!isEmotionalA && !isEmotionalB) {
    score += 8;
    strengths.push(lang === 'id' 
      ? "Kejelasan komunikasi yang cepat dan instingtif" 
      : "Fast and instinctive communication clarity");
  }

  const adviceText = lang === 'id'
    ? `Kunci hubungan ini adalah menghargai strategi ${translateHDType(a.hdType, lang)} dan ${translateHDType(b.hdType, lang)}.`
    : `The key is to respect the strategies of ${translateHDType(a.hdType, lang)} and ${translateHDType(b.hdType, lang)}.`;

  return {
    score: Math.min(98, Math.max(22, score)),
    headline: resonance.head[lang],
    archetype: resonance.arch[lang],
    strengths: Array.from(new Set(strengths)),
    challenges: Array.from(new Set(challenges)),
    advice: lang === 'id' 
      ? "Gunakan peta energi ini sebagai panduan navigasi konflik." 
      : "Use this energy map as a guide for navigating conflict.",
    communicationAdvice: adviceText
  };
};
