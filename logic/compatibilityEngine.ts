
import { PersonData, CompatibilityResult, HDType, HDAuthority } from '../types';

// Fungsi bantuan untuk mendapatkan angka deterministik dari string (hashing sederhana)
const getHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
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

export const getCareerPath = (hdType: string, element: string): string => {
  const base = {
    'Generator': "Pakar operasional, ahli teknik, atau spesialis di bidang yang membutuhkan dedikasi jangka panjang.",
    'Generator Manifesting': "Wiraswasta multi-disiplin, manajer proyek cepat, atau kreator konten yang dinamis.",
    'Proyektor': "Konsultan strategi, psikolog, penasihat manajemen, atau pemandu bakat.",
    'Manifestor': "Inovator independen, pendiri gerakan, pionir industri, atau seniman otonom.",
    'Reflektor': "Auditor kualitas, konsultan budaya organisasi, mediator tingkat tinggi, atau pengamat tren global."
  }[hdType] || "Profesional kreatif dengan fokus pada keahlian spesifik.";

  const elementMod = {
    'Logam': " Bidang keuangan atau hukum sangat cocok.",
    'Air': " Sektor komunikasi atau seni mengalir lebih baik.",
    'Kayu': " Bidang pendidikan atau pengembangan diri sangat disarankan.",
    'Api': " Sektor pemasaran atau hiburan akan membara.",
    'Tanah': " Real estat atau keberlanjutan adalah fondasi yang kuat."
  }[element] || "";

  return base + elementMod;
};

export const getMockHDData = (dateStr: string, name: string) => {
  const hash = getHash(dateStr + name);
  const types = Object.values(HDType);
  const authorities = Object.values(HDAuthority);
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
  
  const rawType = types[hash % types.length];
  const rawAuth = authorities[(hash >> 2) % authorities.length];
  const hdTypeTranslated = translateHDType(rawType);
  const shioData = getShio(dateStr);

  return {
    hdType: hdTypeTranslated,
    hdAuthority: translateHDAuthority(rawAuth),
    hdProfile: profiles[(hash >> 4) % profiles.length],
    careerPath: getCareerPath(hdTypeTranslated, shioData.element)
  };
};

export const calculateCompatibility = (a: any, b: any): CompatibilityResult & { summary?: string, communicationAdvice: string } => {
  let score = 50; 
  let archetype = "Koneksi Eksploratif";
  let headline = "Pertemuan Dua Energi Unik";
  let communicationAdvice = "Mulailah dengan saling memahami batasan energi masing-masing.";
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  const typeA = a.hdType;
  const typeB = b.hdType;
  const profileA = a.hdProfile;
  const profileB = b.hdProfile;

  // Skor Dasar Berdasarkan Tipe
  const combination = [typeA, typeB].sort().join(' & ');
  
  const typeLogic: Record<string, {s: number, arch: string, head: string, comm: string, str: string[], chal: string[]}> = {
    'Generator & Proyektor': {
      s: 35, arch: "Alkemis Energi", head: "Kombinasi Paling Sinergis",
      comm: "Proyektor perlu memberikan pandangan saat diundang, Generator merespons dengan kejujuran.",
      str: ["Efisiensi tinggi", "Visi yang jelas"], chal: ["Overwhelming untuk Proyektor"]
    },
    'Generator & Generator': {
      s: 25, arch: "Pembangun Kuat", head: "Kekuatan Tanpa Henti",
      comm: "Gunakan pertanyaan ya/tidak untuk memicu respons sakral masing-masing.",
      str: ["Ritme kerja sama", "Ketabahan"], chal: ["Frustrasi jika salah arah"]
    },
    'Generator Manifesting & Proyektor': {
      s: 30, arch: "Koneksi Cepat & Tajam", head: "Dinamika Modern",
      comm: "Hargai kecepatan MG, tapi Proyektor harus menjaga agar MG tidak melewatkan langkah penting.",
      str: ["Inovasi cepat", "Strategi jitu"], chal: ["MG terlalu mendominasi"]
    },
    'Manifestor & Proyektor': {
      s: 20, arch: "Duo Visioner", head: "Pengaruh Luar Biasa",
      comm: "Manifestor harus memberi tahu sebelum bertindak, Proyektor menunggu undangan untuk memandu.",
      str: ["Inspirasi besar", "Kemandirian"], chal: ["Perebutan kontrol"]
    },
    'Manifestor & Generator': {
      s: 15, arch: "Api & Bahan Bakar", head: "Intensitas Tinggi",
      comm: "Manifestor menginisiasi, Generator merespons. Jangan saling memaksa peran.",
      str: ["Output besar", "Aksi nyata"], chal: ["Kurangnya diplomasi"]
    }
  };

  const logic = typeLogic[combination] || {
    s: 10, arch: "Pertemuan Misterius", head: "Dinamika yang Menantang",
    comm: "Dibutuhkan kesabaran ekstra untuk memahami ritme energi yang sangat berbeda.",
    str: ["Sudut pandang baru", "Saling melengkapi"], chal: ["Ketidaksinkronan jadwal"]
  };

  score += logic.s;
  archetype = logic.arch;
  headline = logic.head;
  communicationAdvice = logic.comm;
  strengths.push(...logic.str);
  challenges.push(...logic.chal);

  // Bonus Profil (Lines)
  const lineA = profileA.split('/')[0];
  const lineB = profileB.split('/')[0];
  if (lineA === lineB) {
    score += 15;
    strengths.push(`Harmoni Garis ${lineA} yang Sama`);
  } else if ((lineA === '1' && lineB === '4') || (lineA === '2' && lineB === '5')) {
    score += 10;
    strengths.push("Resonansi Profil Alami");
  }

  // Bonus Otoritas
  if (a.hdAuthority === b.hdAuthority) {
    score += 5;
    strengths.push("Kejelasan Pengambilan Keputusan");
  } else if (a.hdAuthority === 'Emosional' || b.hdAuthority === 'Emosional') {
    challenges.push("Perbedaan Kecepatan Keputusan");
    communicationAdvice += " Ingatlah: 'Tidak ada kebenaran saat ini' bagi otoritas emosional.";
  }

  // Final Polish
  if (score > 80) headline = "Sinergi Kosmik Sempurna";
  else if (score > 60) headline = "Koneksi yang Bertumbuh";

  return {
    score: Math.min(100, Math.max(10, score)),
    headline,
    archetype,
    strengths: Array.from(new Set(strengths)),
    challenges: Array.from(new Set(challenges)),
    advice: "Hargai tanda-tanda energi unik satu sama lain setiap hari untuk menjaga aliran positif.",
    communicationAdvice
  };
};
