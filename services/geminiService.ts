
import { BirthData, FullAnalysisResponse } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData): Promise<FullAnalysisResponse> => {
  const personA_HD = getMockHDData(aData.date, aData.time, aData.name);
  const personB_HD = getMockHDData(bData.date, bData.time, bData.name);
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
    summary = `Koneksi antara ${personA.name} dan ${personB.name} adalah manifestasi dari harmoni tingkat tinggi. Kalian tidak hanya saling melengkapi secara energi, tetapi juga memiliki visi jiwa yang selaras. Dinamika ${personA.hdType} dan ${personB.hdType} kalian menciptakan aliran alami yang saling menguatkan.`;
  } else if (score >= 75) {
    summary = `${personA.name} dan ${personB.name} memiliki fondasi yang sangat kuat untuk hubungan jangka panjang. Ada keseimbangan antara aksi dan refleksi yang memungkinkan kalian tumbuh bersama tanpa saling mendominasi.`;
  } else if (score >= 60) {
    summary = `Hubungan ini menawarkan ruang pertumbuhan yang signifikan bagi ${personA.name} dan ${personB.name}. Meskipun ada perbedaan mendasar dalam ritme komunikasi, kalian memiliki cukup banyak titik temu untuk membangun sesuatu yang berarti.`;
  } else {
    summary = `Dinamika ini cukup menantang dan membutuhkan kesadaran diri yang tinggi dari ${personA.name} dan ${personB.name}. Fokuslah pada pemberian ruang bagi otonomi masing-masing agar hubungan tetap sehat.`;
  }

  const moonSignsID = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagitarius", "Kaprikornus", "Akuarius", "Pisces"];
  const getMoonIdx = (d: string) => (new Date(d).getDate() + new Date(d).getMonth()) % 12;

  return {
    personA: { ...personA, moonSign: moonSignsID[getMoonIdx(aData.date)] },
    personB: { ...personB, moonSign: moonSignsID[getMoonIdx(bData.date)] },
    compatibility: {
      ...baseComp,
      summary
    }
  };
};
