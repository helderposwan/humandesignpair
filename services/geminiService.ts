
import { BirthData, FullAnalysisResponse, Language } from "../types.ts";
import { getZodiacSign, getShio, getMockHDData, calculateCompatibility } from "../logic/compatibilityEngine.ts";

/**
 * getFullCosmicAnalysis provides high-quality Human Design analysis.
 * This function works entirely LOCALLY without requiring an external API key,
 * satisfying the requirement for deterministic and consistent results.
 */
export const getFullCosmicAnalysis = async (aData: BirthData, bData: BirthData, lang: Language = 'id'): Promise<FullAnalysisResponse> => {
  // Process individual profiles with Lang
  const personA_HD = getMockHDData(aData.date, aData.time, aData.name, aData.location, lang);
  const personB_HD = getMockHDData(bData.date, bData.time, bData.name, bData.location, lang);
  
  const shioA = getShio(aData.date, lang);
  const shioB = getShio(bData.date, lang);

  const moonSignsID = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagitarius", "Kaprikornus", "Akuarius", "Pisces"];
  const moonSignsEN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  const getMoonIdx = (d: string) => {
    const date = new Date(d);
    return (date.getDate() + date.getMonth() + (date.getFullYear() % 12)) % 12;
  };

  const personA = {
    name: aData.name,
    ...personA_HD,
    sunSign: getZodiacSign(aData.date, lang),
    moonSign: lang === 'id' ? moonSignsID[getMoonIdx(aData.date)] : moonSignsEN[getMoonIdx(aData.date)], 
    shio: shioA.animal,
    element: shioA.element,
  };

  const personB = {
    name: bData.name,
    ...personB_HD,
    sunSign: getZodiacSign(bData.date, lang),
    moonSign: lang === 'id' ? moonSignsID[getMoonIdx(bData.date)] : moonSignsEN[getMoonIdx(bData.date)],
    shio: shioB.animal,
    element: shioB.element,
  };

  // Calculate compatibility locally with Lang
  const baseComp = calculateCompatibility(personA, personB, lang);
  const score = baseComp.score;

  // Generate nuanced summary based on HD properties locally
  let summary = "";
  if (lang === 'id') {
    if (score >= 85) {
      summary = `Koneksi antara ${personA.name} dan ${personB.name} adalah manifestasi dari harmoni energi tingkat tinggi. Dengan dinamika ${personA.hdType} dan ${personB.hdType}, kalian memiliki kapasitas unik untuk menciptakan sinergi tanpa gesekan yang berarti. Kuncinya adalah saling menghargai otoritas ${personA.hdAuthority} dan ${personB.hdAuthority} masing-masing dalam navigasi harian.`;
    } else if (score >= 70) {
      summary = `Kalian berdua memiliki fondasi yang solid untuk kolaborasi jangka panjang. Ada daya tarik alami antara profil ${personA.hdProfile} dan ${personB.hdProfile} yang menciptakan rasa saling melengkapi. ${personA.name} memberikan stabilitas sementara ${personB.name} membawa perspektif baru, menciptakan aliran energi yang produktif.`;
    } else if (score >= 55) {
      summary = `Hubungan ini adalah perjalanan pertumbuhan yang menarik. Dinamika antara ${personA.hdType} dan ${personB.hdType} mungkin membutuhkan waktu untuk sinkronisasi, namun begitu kalian memahami strategi 'To Respond' atau inisiatif masing-masing, harmoni akan tercipta secara natural.`;
    } else {
      summary = `Dinamika ini menawarkan pelajaran berharga tentang kemandirian dan batasan energi. ${personA.name} dan ${personB.name} memiliki ritme yang sangat berbeda secara esensial. Memberi ruang bagi otonomi satu sama lain adalah cara terbaik untuk menjaga keharmonisan tanpa merasa terkekang.`;
    }
  } else {
    // English Summary
    if (score >= 85) {
      summary = `The connection between ${personA.name} and ${personB.name} is a high-level energy harmony. With the dynamics of ${personA.hdType} and ${personB.hdType}, you possess a unique capacity to create synergy without significant friction. The key is respecting each other's ${personA.hdAuthority} and ${personB.hdAuthority} authorities in daily navigation.`;
    } else if (score >= 70) {
      summary = `You both have a solid foundation for long-term collaboration. There is a natural attraction between profile ${personA.hdProfile} and ${personB.hdProfile} that creates complementarity. ${personA.name} provides stability while ${personB.name} brings fresh perspectives, creating a productive energy flow.`;
    } else if (score >= 55) {
      summary = `This relationship is an intriguing journey of growth. The dynamic between ${personA.hdType} and ${personB.hdType} may require time for synchronization, but once you understand each other's strategies, harmony will emerge naturally.`;
    } else {
      summary = `This dynamic offers valuable lessons on independence and energy boundaries. ${personA.name} and ${personB.name} have essentially different rhythms. Giving space for each other's autonomy is the best way to maintain harmony without feeling restricted.`;
    }
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
