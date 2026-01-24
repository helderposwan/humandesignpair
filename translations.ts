
import { Language } from './types';

export const translations = {
  id: {
    loading: {
      processing: "MEMPROSES",
      decoding: "MENERJEMAHKAN MEKANIKA KOSMIK",
      calibrating: "KALIBRASI",
      generating: "MEMBUAT LAPORAN..."
    },
    intro: {
      subtitle: "Analisis kecocokan berbasis Human Design & Algoritma Kosmik",
      startBtn: "MULAI ANALISIS"
    },
    input: {
      title: "INPUT DATA",
      subtitle: "Masukkan detail kelahiran untuk kalkulasi presisi",
      labelAlpha: "SUBJEK ALPHA",
      labelBeta: "SUBJEK BETA",
      placeholderName: "NAMA LENGKAP",
      placeholderDate: "TGL LAHIR",
      placeholderTime: "JAM",
      placeholderCity: "KOTA KELAHIRAN",
      processBtn: "PROSES DATA"
    },
    results: {
      matchReport: "LAPORAN KECOCOKAN",
      resonanceScore: "TINGKAT RESONANSI ENERGI BERDASARKAN PARAMETER HUMAN DESIGN",
      type: "Tipe",
      profile: "Profil",
      authority: "Otoritas",
      sunSign: "Zodiak",
      verdict: "VERDICT ANALISIS",
      resonance: "RESONANSI",
      friction: "FRIKSI",
      newAnalysis: "← Analisis Baru",
      download: "DOWNLOAD REPORT",
      generatedOn: "Dibuat pada",
      verified: "Analisis Terverifikasi",
      summary: "RINGKASAN"
    }
  },
  en: {
    loading: {
      processing: "PROCESSING",
      decoding: "DECODING CELESTIAL MECHANICS",
      calibrating: "CALIBRATING",
      generating: "GENERATING..."
    },
    intro: {
      subtitle: "Compatibility analysis based on Human Design & Cosmic Algorithms",
      startBtn: "START ANALYSIS"
    },
    input: {
      title: "DATA INPUT",
      subtitle: "Enter birth details for precise calculation",
      labelAlpha: "SUBJECT ALPHA",
      labelBeta: "SUBJECT BETA",
      placeholderName: "FULL NAME",
      placeholderDate: "BIRTH DATE",
      placeholderTime: "TIME",
      placeholderCity: "BIRTH CITY",
      processBtn: "PROCESS DATA"
    },
    results: {
      matchReport: "MATCH REPORT",
      resonanceScore: "ENERGY RESONANCE LEVEL BASED ON HUMAN DESIGN PARAMETERS",
      type: "Type",
      profile: "Profile",
      authority: "Authority",
      sunSign: "Sign",
      verdict: "ANALYSIS VERDICT",
      resonance: "RESONANCE",
      friction: "FRICTION",
      newAnalysis: "← New Analysis",
      download: "DOWNLOAD REPORT",
      generatedOn: "Generated on",
      verified: "Verified Analysis",
      summary: "SUMMARY"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
