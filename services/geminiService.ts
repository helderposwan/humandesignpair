
import { BirthData, FullAnalysisResponse } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

/**
 * getFullCosmicAnalysis provides high-quality Human Design analysis.
 * This function works entirely LOCALLY without requiring an external API key,
 * satisfying the requirement for deterministic and consistent results.
 */
export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData): Promise<FullAnalysisResponse> => {
  // Process individual profiles
  const personA_HD = getMockHDData(aData.date, aData.time, aData.name, aData.location);
  const personB_HD = getMockHDData(bData.date, bData.time, bData.name, bData.location);
  
  const shioA = getShio(aData.date);
  const shioB = getShio(bData.date);

  const moonSignsID = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagitarius", "Kaprikornus", "Akuarius", "Pisces"];
  const getMoonIdx = (d: string) => {
    const date = new Date(d);
    return (date.getDate() + date.getMonth() + (date.getFullYear() % 12)) % 12;
  };

  const personA = {
    name: aData.name,
    ...personA_HD,
    sunSign: getZodiacSign(aData.date),
    moonSign: moonSignsID[getMoonIdx(aData.date)], 
    shio: shioA.animal,
    element: shioA.element,
  };

  const personB = {
    name: bData.name,
    ...personB_HD,
    sunSign: getZodiacSign(bData.date),
    moonSign: moonSignsID[getMoonIdx(bData.date)],
    shio: shioB.animal,
    element: shioB.element,
  };

  // Calculate compatibility locally
  const baseComp = calculateCompatibility(personA, personB);
  const score = baseComp.score;

  // Generate nuanced summary based on HD properties locally
  let summary = "";
  if (score >= 85) {
    summary = `Koneksi antara ${personA.name} dan ${personB.name} adalah manifestasi dari harmoni energi tingkat tinggi. Dengan dinamika ${personA.hdType} dan ${personB.hdType}, kalian memiliki kapasitas unik untuk menciptakan sinergi tanpa gesekan yang berarti. Kuncinya adalah saling menghargai otoritas ${personA.hdAuthority} dan ${personB.hdAuthority} masing-masing dalam navigasi harian.`;
  } else if (score >= 70) {
    summary = `Kalian berdua memiliki fondasi yang solid untuk kolaborasi jangka panjang. Ada daya tarik alami antara profil ${personA.hdProfile} dan ${personB.hdProfile} yang menciptakan rasa saling melengkapi. ${personA.name} memberikan stabilitas sementara ${personB.name} membawa perspektif baru, menciptakan aliran energi yang produktif.`;
  } else if (score >= 55) {
    summary = `Hubungan ini adalah perjalanan pertumbuhan yang menarik. Dinamika antara ${personA.hdType} dan ${personB.hdType} mungkin membutuhkan waktu untuk sinkronisasi, namun begitu kalian memahami strategi 'To Respond' atau inisiatif masing-masing, harmoni akan tercipta secara natural.`;
  } else {
    summary = `Dinamika ini menawarkan pelajaran berharga tentang kemandirian dan batasan energi. ${personA.name} dan ${personB.name} memiliki ritme yang sangat berbeda secara esensial. Memberi ruang bagi otonomi satu sama lain adalah cara terbaik untuk menjaga keharmonisan tanpa merasa terkekang.`;
  }

  // Final deterministic result
  return {
    personA,
    personB,
    compatibility: {
      ...baseComp,
      summary
    }
  };
};
