
import { BirthData, FullAnalysisResponse } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

/**
 * Menghasilkan analisis kompatibilitas kosmik secara lokal.
 * Tidak lagi menggunakan Gemini API untuk menghindari masalah API Key.
 */
export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData): Promise<FullAnalysisResponse> => {
  // 1. Kalkulasi data deterministik (Human Design, Zodiac, Shio)
  const personA_HD = getMockHDData(aData.date);
  const personB_HD = getMockHDData(bData.date);
  const shioA = getShio(aData.date);
  const shioB = getShio(bData.date);

  const personA = {
    name: aData.name,
    ...personA_HD,
    sunSign: getZodiacSign(aData.date),
    moonSign: "Mystic Moon", 
    shio: shioA.animal,
    element: shioA.element
  };

  const personB = {
    name: bData.name,
    ...personB_HD,
    sunSign: getZodiacSign(bData.date),
    moonSign: "Mystic Moon",
    shio: shioB.animal,
    element: shioB.element
  };

  // 2. Kalkulasi skor dan metadata kompatibilitas
  const baseComp = calculateCompatibility(personA, personB);

  // 3. Menghasilkan "Emotional Tone Summary" secara lokal berdasarkan skor
  // Simulasi "AI Phrasing" dengan template yang berkualitas
  let summary = "";
  const score = baseComp.score;

  if (score >= 85) {
    summary = `Hubungan antara ${personA.name} dan ${personB.name} adalah resonansi jiwa yang langka. Energi kalian saling menguatkan, menciptakan aliran alami di mana dukungan terasa tanpa usaha. Ini adalah kemitraan yang dibangun di atas pemahaman kosmik yang mendalam.`;
  } else if (score >= 70) {
    summary = `${personA.name} dan ${personB.name} memiliki dinamika yang sangat produktif. Ada keseimbangan antara memberikan arahan dan memberikan energi. Tantangan kecil mungkin muncul, namun fondasi kalian cukup kuat untuk mengubah gesekan menjadi pertumbuhan kreatif.`;
  } else if (score >= 50) {
    summary = `Kalian berdua membawa perspektif yang sangat berbeda ke dalam hubungan ini. Meskipun membutuhkan waktu untuk sinkronisasi, perbedaan ini justru menjadi kekuatan jika kalian saling menghargai ritme unik masing-masing. Komunikasi adalah kunci evolusi kalian.`;
  } else {
    summary = `Hubungan ini adalah ruang pembelajaran yang intens bagi ${personA.name} dan ${personB.name}. Fokuslah pada pemberian ruang bagi otonomi masing-masing. Dengan kesadaran tinggi, kalian bisa melampaui hambatan komunikasi awal menjadi koneksi yang lebih dewasa.`;
  }

  // Memberikan sedikit variasi pada Moon Sign berdasarkan tanggal (simulasi)
  const moonSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const getMoonIdx = (d: string) => (new Date(d).getDate() + new Date(d).getMonth()) % 12;

  return {
    personA: { ...personA, moonSign: moonSigns[getMoonIdx(aData.date)] },
    personB: { ...personB, moonSign: moonSigns[getMoonIdx(bData.date)] },
    compatibility: {
      ...baseComp,
      summary
    }
  };
};
