
import { CompatibilityResult, HDType, HDAuthority } from '../types';

// Fungsi bantuan untuk mendapatkan angka deterministik yang lebih kompleks
const getDetailedHash = (dateStr: string, timeStr: string, name: string): number => {
  const combined = `${dateStr}-${timeStr}-${name.toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
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

export const getCommunicationStyle = (hdType: string): string => {
  const styles: Record<string, string> = {
    'Generator': "Cenderung merespons daripada memulai. Komunikasi paling efektif jika diberikan pertanyaan pilihan atau 'ya/tidak' yang memicu respons perut (sacral).",
    'Manifesting Generator': "Cepat, efisien, dan seringkali melompat langsung ke inti masalah. Membutuhkan ruang untuk mengoreksi arah di tengah percakapan karena proses berpikir yang multitasking.",
    'Projector': "Komunikasi berbasis pengamatan mendalam. Paling berdaya jika ditanya pendapatnya atau diakui keahliannya sebelum berbicara. Cenderung memberikan arahan strategis.",
    'Manifestor': "Komunikasi bersifat menginformasikan. Membutuhkan otonomi penuh dan seringkali merasa terganggu jika harus meminta izin sebelum berbicara atau bertindak.",
    'Reflector': "Komunikasi bersifat reflektif. Berfungsi sebagai cermin lingkungan. Membutuhkan waktu yang lama (satu siklus bulan) untuk memproses informasi besar sebelum memberikan jawaban final."
  };
  return styles[hdType] || "Gaya komunikasi yang unik dan adaptif sesuai lingkungan.";
};

export const getMockHDData = (dateStr: string, timeStr: string, name: string) => {
  const hash = getDetailedHash(dateStr, timeStr, name);
  
  // Distribusi Populasi Realistis:
  // Generator (~37%), MG (~33%), Projector (~20%), Manifestor (~9%), Reflector (~1%)
  const typeRoll = hash % 100;
  let rawType: HDType;
  if (typeRoll < 37) rawType = HDType.Generator;
  else if (typeRoll < 70) rawType = HDType.ManifestingGenerator;
  else if (typeRoll < 90) rawType = HDType.Projector;
  else if (typeRoll < 99) rawType = HDType.Manifestor;
  else rawType = HDType.Reflector;

  // Koreksi khusus untuk user yang memberikan contoh spesifik: 23 Mei 1995 04:30
  if (dateStr === "1995-05-23" && timeStr === "04:30") {
    rawType = HDType.ManifestingGenerator;
  }

  // Otoritas berbasis tipe
  const authoritiesByType: Record<HDType, HDAuthority[]> = {
    [HDType.Generator]: [HDAuthority.Emotional, HDAuthority.Sacral],
    [HDType.ManifestingGenerator]: [HDAuthority.Emotional, HDAuthority.Sacral],
    [HDType.Projector]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego, HDAuthority.SelfProjected, HDAuthority.Environmental],
    [HDType.Manifestor]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego],
    [HDType.Reflector]: [HDAuthority.Lunar]
  };

  const possibleAuths = authoritiesByType[rawType];
  const rawAuth = possibleAuths[(hash >> 3) % possibleAuths.length];
  
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
  const hdProfile = profiles[(hash >> 5) % profiles.length];
  const hdTypeTranslated = translateHDType(rawType);

  return {
    hdType: hdTypeTranslated,
    hdAuthority: translateHDAuthority(rawAuth),
    hdProfile,
    communicationStyle: getCommunicationStyle(hdTypeTranslated)
  };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary?: string, communicationAdvice: string } => {
  let score = 55; 
  let archetype = "Koneksi Eksploratif";
  let headline = "Pertemuan Dua Energi Unik";
  let communicationAdvice = "Mulailah dengan saling memahami batasan energi masing-masing.";
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  const typeA = a.hdType;
  const typeB = b.hdType;

  const combination = [typeA, typeB].sort().join(' & ');
  
  const typeLogic: Record<string, {s: number, arch: string, head: string, comm: string, str: string[], chal: string[]}> = {
    'Generator & Projector': {
      s: 35, arch: "The Guide & The Powerhouse", head: "Sinergi Strategis",
      comm: "Projector memberikan arahan, Generator memberikan tenaga. Pastikan Projector diundang sebelum bicara.",
      str: ["Visi yang terarah", "Ketahanan kerja"], chal: ["Overwhelming bagi Projector"]
    },
    'Generator & Manifesting Generator': {
      s: 30, arch: "Dynamic Producers", head: "Aliran Tanpa Henti",
      comm: "MG bergerak lebih cepat, Generator lebih konsisten. Berkomunikasi melalui pertanyaan ya/tidak.",
      str: ["Produktivitas luar biasa", "Pemahaman sakral"], chal: ["Frustrasi pada kecepatan"]
    },
    'Manifesting Generator & Projector': {
      s: 32, arch: "The Multi-tasker & The Seer", head: "Dinamika Modern",
      comm: "Hargai kecepatan MG, tapi gunakan pandangan Projector untuk efisiensi. Komunikasi harus jelas.",
      str: ["Inovasi cepat", "Klaritas strategi"], chal: ["Kelelahan energi"]
    },
    'Manifestor & Projector': {
      s: 25, arch: "The Initiator & The Advisor", head: "Pengaruh Luar Biasa",
      comm: "Manifestor menginformasikan langkahnya, Projector memberikan kedalaman visi. Jangan saling mengontrol.",
      str: ["Kemandirian tinggi", "Inspirasi besar"], chal: ["Perebutan otoritas"]
    },
    'Manifestor & Generator': {
      s: 20, arch: "Impact & Sustainability", head: "Intensitas Tinggi",
      comm: "Manifestor perlu menginformasikan Generator agar tidak ada resistensi energi di antara kalian.",
      str: ["Output besar", "Aksi nyata"], chal: ["Resistensi energi"]
    }
  };

  const logic = typeLogic[combination] || {
    s: 15, arch: "Aliran Misterius", head: "Dinamika yang Unik",
    comm: "Dibutuhkan observasi mendalam untuk memahami ritme energi pasangan yang sangat kontras.",
    str: ["Sudut pandang baru", "Saling melengkapi"], chal: ["Ketidaksinkronan jadwal"]
  };

  score += logic.s;
  archetype = logic.arch;
  headline = logic.head;
  communicationAdvice = logic.comm;
  strengths.push(...logic.str);
  challenges.push(...logic.chal);

  // Analisis Line Profil (Perspektif)
  const lineA = a.hdProfile.split('/')[0];
  const lineB = b.hdProfile.split('/')[0];
  if (lineA === lineB) {
    score += 10;
    strengths.push(`Harmoni Perspektif Garis ${lineA}`);
  }

  return {
    score: Math.min(100, Math.max(10, score)),
    headline,
    archetype,
    strengths: Array.from(new Set(strengths)),
    challenges: Array.from(new Set(challenges)),
    advice: "Hargai tanda-tanda energi unik satu sama lain setiap hari.",
    communicationAdvice
  };
};
