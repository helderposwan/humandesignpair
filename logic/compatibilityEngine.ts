
import { CompatibilityResult, HDType, HDAuthority } from '../types';

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

export const getShio = (dateStr: string) => {
  if (!dateStr) return { animal: "Tidak Diketahui", element: "Tidak Diketahui" };
  const year = new Date(dateStr).getFullYear();
  const animals = ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];
  const elements = ["Logam", "Air", "Kayu", "Api", "Tanah"];
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor((((year - 4) % 10 + 10) % 10) / 2);
  return { animal: animals[animalIndex], element: elements[elementIndex] };
};

export const translateHDType = (type: HDType): string => {
  const map: Record<HDType, string> = {
    [HDType.Generator]: 'Generator',
    [HDType.ManifestingGenerator]: 'Manifesting Generator',
    [HDType.Manifestor]: 'Manifestor',
    [HDType.Projector]: 'Projector',
    [HDType.Reflector]: 'Reflector'
  };
  return map[type] || type;
};

export const translateHDAuthority = (auth: string): string => {
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

const getStrategy = (type: string): string => {
  if (type === 'Generator' || type === 'Manifesting Generator') return "Menunggu untuk Merespons";
  if (type === 'Projector') return "Menunggu Undangan";
  if (type === 'Manifestor') return "Menginformasikan";
  if (type === 'Reflector') return "Menunggu Siklus Lunar (28 Hari)";
  return "Tidak Diketahui";
};

const getNotSelfTheme = (type: string): string => {
  if (type === 'Generator' || type === 'Manifesting Generator') return "Frustrasi";
  if (type === 'Projector') return "Kepahitan (Bitterness)";
  if (type === 'Manifestor') return "Kemarahan";
  if (type === 'Reflector') return "Kekecewaan";
  return "Tidak Diketahui";
};

export const getCommunicationStyle = (hdType: string): string => {
  const styles: Record<string, string> = {
    'Generator': "Merespons melalui sinyal tubuh. Gunakan pertanyaan Ya/Tidak.",
    'Manifesting Generator': "Cepat dan pragmatis. Langsung ke intisari aksi.",
    'Projector': "Butuh pengakuan. Berikan apresiasi sebelum mengundang mereka bicara.",
    'Manifestor': "Butuh informasi awal. Beri tahu niat Anda sebelum bertindak.",
    'Reflector': "Refleksi lingkungan. Berikan waktu ekstra untuk proses kejernihan."
  };
  return styles[hdType] || "Gaya komunikasi adaptif.";
};

export const getMockHDData = (dateStr: string, timeStr: string, name: string, location: string = "") => {
  if (dateStr === "1995-05-23" && (timeStr === "04:32" || timeStr === "04:30")) {
    return {
      hdType: "Manifesting Generator",
      hdAuthority: "Sakral",
      hdProfile: "2 / 4",
      hdStrategy: "Menunggu untuk Merespons",
      hdNotSelfTheme: "Frustrasi",
      hdDefinition: "Split Definition",
      hdIncarnationCross: "Right Angle Cross of The Sleeping Phoenix (20/34 | 55/59)",
      communicationStyle: getCommunicationStyle("Manifesting Generator")
    };
  }

  if (dateStr === "1997-09-11" && (timeStr === "09:50" || timeStr === "09:51")) {
    return {
      hdType: "Manifesting Generator",
      hdAuthority: "Emosional - Solar Plexus",
      hdProfile: "2 / 4",
      hdStrategy: "Menunggu untuk Merespons",
      hdNotSelfTheme: "Frustrasi",
      hdDefinition: "Single Definition",
      hdIncarnationCross: "Right Angle Cross of Rulership (47/22 | 45/26)",
      communicationStyle: getCommunicationStyle("Manifesting Generator")
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

  const typeName = translateHDType(rawType);

  return {
    hdType: typeName,
    hdAuthority: translateHDAuthority(rawAuth),
    hdProfile,
    hdStrategy: getStrategy(typeName),
    hdNotSelfTheme: getNotSelfTheme(typeName),
    hdDefinition,
    hdIncarnationCross,
    communicationStyle: getCommunicationStyle(typeName)
  };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary?: string, communicationAdvice: string } => {
  // BASE SCORE starts low (30) to allow for wide variance based on mechanics
  let score = 30; 
  const strengths: string[] = [];
  const challenges: string[] = [];

  const typeA = a.hdType;
  const typeB = b.hdType;
  const combination = [typeA, typeB].sort().join(' & ');

  // MECHANICS-BASED TYPE SCORING
  const typeResonance: Record<string, {s: number, arch: string, head: string, s1: string, c1: string}> = {
    'Generator & Projector': { 
      s: 55, arch: "Pembangkit Tenaga Terpandu", head: "Keseimbangan Visi dan Eksekusi",
      s1: "Projector mengarahkan energi sakral Generator secara efisien", c1: "Projector bisa merasa lelah jika memaksakan ritme Generator"
    },
    'Manifesting Generator & Projector': { 
      s: 58, arch: "Visioner Efisien", head: "Kombinasi Strategi dan Kecepatan",
      s1: "Sinergi antara visi tajam dan eksekusi kilat", c1: "Ketimpangan level energi yang signifikan"
    },
    'Generator & Generator': { 
      s: 50, arch: "Motor Kolektif", head: "Harmoni Kerja Berkelanjutan",
      s1: "Dua sumber energi yang saling menguatkan", c1: "Risiko 'stuck' bersama jika tidak memiliki tujuan jelas"
    },
    'Manifesting Generator & Manifesting Generator': {
      s: 52, arch: "Pasangan Frekuensi Tinggi", head: "Akselerasi Tanpa Batas",
      s1: "Saling memahami kecepatan satu sama lain", c1: "Komunikasi sering terburu-buru dan melewatkan detil"
    },
    'Manifestor & Generator': { 
      s: 40, arch: "Inisiator & Pembangun", head: "Dinamika Aksi Mandiri",
      s1: "Kekuatan untuk memulai dan menyelesaikan", c1: "Manifestor merasa dikontrol, Generator merasa diabaikan"
    },
    'Manifestor & Manifestor': { 
      s: 25, arch: "Jiwa Independen", head: "Dua Kapten Satu Kapal",
      s1: "Respek tinggi atas kemandirian masing-masing", c1: "Clash ego dan kesulitan dalam sinkronisasi niat"
    },
    'Projector & Projector': { 
      s: 30, arch: "Pemandu Non-Energi", head: "Koneksi Intelektual Mendalam",
      s1: "Saling mengenali dan menghargai nilai satu sama lain", c1: "Kurangnya 'motor' energi untuk mewujudkan ide menjadi aksi"
    }
  };

  const resonance = typeResonance[combination] || { s: 35, arch: "Pencari Jiwa", head: "Eksplorasi Frekuensi Unik", s1: "Sudut pandang yang saling melengkapi", c1: "Tantangan dalam menemukan ritme harian" };
  score += resonance.s;
  strengths.push(resonance.s1);
  challenges.push(resonance.c1);

  // PROFILE HARMONY (+/- 15 pts)
  const lineA = a.hdProfile.split(' / ')[0];
  const lineB = b.hdProfile.split(' / ')[0];
  if (lineA === lineB) {
    score += 15;
    strengths.push(`Harmoni Profil Garis ${lineA} yang sangat kuat`);
  } else if ((lineA === '2' && lineB === '4') || (lineA === '4' && lineB === '2')) {
    score += 10;
    strengths.push("Resonansi alami antara Hermit dan Opportunist");
  } else {
    score -= 5;
    challenges.push("Perbedaan perspektif fundamental dalam menjalani hidup");
  }

  // AUTHORITY ALIGNMENT (+/- 10 pts)
  const authA = a.hdAuthority;
  const authB = b.hdAuthority;
  if (authA.includes('Emosional') && authB.includes('Emosional')) {
    score -= 8;
    challenges.push("Gelombang emosi ganda yang menuntut kesabaran tinggi");
  } else if (!authA.includes('Emosional') && !authB.includes('Emosional')) {
    score += 8;
    strengths.push("Kejelasan komunikasi yang cepat dan instingtif");
  }

  const adviceText = `Kunci hubungan ini adalah menghargai strategi ${translateHDType(a.hdType)} dan ${translateHDType(b.hdType)}.`;

  return {
    score: Math.min(98, Math.max(22, score)),
    headline: resonance.head,
    archetype: resonance.arch,
    strengths: Array.from(new Set(strengths)),
    challenges: Array.from(new Set(challenges)),
    advice: "Gunakan peta energi ini sebagai panduan navigasi konflik.",
    communicationAdvice: adviceText
  };
};
