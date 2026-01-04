
import { BirthData, FullAnalysisResponse } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData): Promise<FullAnalysisResponse> => {
  // Menyertakan location dalam mock data untuk presisi deterministik
  const personA_HD = getMockHDData(aData.date, aData.time, aData.name, aData.location);
  const personB_HD = getMockHDData(bData.date, bData.time, bData.name, bData.location);
  const shioA = getShio(aData.date);
  const shioB = getShio(bData.date);

  const personA = {
    name: aData.name,
    ...personA_HD,
    sunSign: getZodiacSign(aData.date),
    moonSign: "Bulan Mistik", 
    shio: shioA.animal,
    element: shioA.element,
  };

  const personB = {
    name: bData.name,
    ...personB_HD,
    sunSign: getZodiacSign(bData.date),
    moonSign: "Bulan Mistik",
    shio: shioB.animal,
    element: shioB.element,
  };

  const baseComp = calculateCompatibility(personA, personB);
  const score = baseComp.score;

  let summary = "";
  if (score >= 90) {
    summary = `Koneksi antara ${personA.name} dan ${personB.name} adalah manifestasi dari harmoni tingkat tinggi. Kalian tidak hanya saling melengkapi secara energi, tetapi juga memiliki visi jiwa yang selaras. Dinamika ${personA.hdType} dan ${personB.hdType} kalian menciptakan aliran alami yang saling menguatkan secara konsekuen.`;
  } else if (score >= 75) {
    summary = `${personA.name} dan ${personB.name} memiliki fondasi yang sangat kuat untuk hubungan jangka panjang. Ada keseimbangan antara aksi dan refleksi yang memungkinkan kalian tumbuh bersama secara konkruen tanpa saling mendominasi.`;
  } else if (score >= 60) {
    summary = `Hubungan ini menawarkan ruang pertumbuhan yang signifikan bagi ${personA.name} dan ${personB.name}. Meskipun ada perbedaan ritme, konsistensi dalam upaya memahami pasangan akan membawa hasil yang sangat positif.`;
  } else {
    summary = `Dinamika ini cukup unik dan membutuhkan kesadaran diri yang presisi dari ${personA.name} dan ${personB.name}. Fokuslah pada pemberian ruang bagi otonomi masing-masing agar hubungan tetap sehat dan seimbang.`;
  }

  // Kalkulasi Moon Sign yang lebih stabil berbasis tanggal
  const moonSignsID = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagitarius", "Kaprikornus", "Akuarius", "Pisces"];
  const getMoonIdx = (d: string) => {
    const date = new Date(d);
    return (date.getDate() + date.getMonth() + (date.getFullYear() % 12)) % 12;
  };

  return {
    personA: { ...personA, moonSign: moonSignsID[getMoonIdx(aData.date)] },
    personB: { ...personB, moonSign: moonSignsID[getMoonIdx(bData.date)] },
    compatibility: {
      ...baseComp,
      summary
    }
  };
};
