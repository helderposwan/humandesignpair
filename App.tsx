
import React, { useState, useEffect, useRef } from 'react';
import { BirthData, FullAnalysisResponse } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { getFullCosmicAnalysis } from './services/geminiService.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'input' | 'loading' | 'results'>('welcome');
  const [personA, setPersonA] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [personB, setPersonB] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 'welcome' && headingRef.current) {
      const phrases = [
        "Buka rahasia koneksi dengan pasanganmu.",
        "Temukan harmoni energi kalian berdua.",
        "Ungkap kecocokan jiwa lewat Human Design."
      ];
      
      const tl = gsap.timeline({ repeat: -1 });
      
      phrases.forEach((phrase) => {
        tl.to(headingRef.current, {
          duration: 2.5,
          text: phrase,
          ease: "none",
        })
        .to({}, { duration: 2 }) // Pause at end of phrase
        .to(headingRef.current, {
          duration: 1,
          text: "",
          ease: "none",
        })
        .to({}, { duration: 0.5 }); // Short pause before next phrase
      });

      return () => {
        tl.kill();
      };
    }
  }, [step]);

  const handleReveal = async () => {
    if (!personA.name || !personB.name || !personA.date || !personB.date || !personA.time || !personB.time) {
      alert("Harap isi Nama, Tanggal, dan Jam lahir untuk kedua orang.");
      return;
    }

    setStep('loading');
    
    setTimeout(async () => {
      try {
        const result = await getFullCosmicAnalysis(personA, personB);
        setAnalysis(result);
        setStep('results');
      } catch (error: any) {
        console.error("Analysis Error:", error);
        alert("Terjadi kesalahan saat memproses data. Silakan coba lagi.");
        setStep('input');
      }
    }, 1500);
  };

  const handleDownloadPDF = () => {
    if (!resultsRef.current || !analysis) return;
    
    setIsDownloading(true);
    const element = resultsRef.current;
    const fileName = `Laporan_CosmicVibes_${analysis.personA.name.replace(/\s+/g, '_')}_&_${analysis.personB.name.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2.5, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        backgroundColor: '#fdfcfb'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch((err: any) => {
      console.error("PDF download error:", err);
      setIsDownloading(false);
    });
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
  };

  const ProfileCard = ({ profile, color }: { profile: any, color: string }) => (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      <h4 className={`text-lg font-heading font-bold ${color} mb-3 border-b border-gray-50 pb-2`}>Cetak Biru {profile.name}</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs mb-4">
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter mb-1 font-semibold">Human Design</span>
          <span className="font-bold text-gray-800 block text-sm leading-tight">{profile.hdType}</span>
          <span className="text-gray-500 italic">Profil {profile.hdProfile} • {profile.hdAuthority}</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter mb-1 font-semibold">Astrologi</span>
          <span className="font-bold text-gray-800 block text-sm">☀️ {profile.sunSign}</span>
          <span className="text-gray-500">🌙 {profile.moonSign}</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter mb-1 font-semibold">Shio & Elemen</span>
          <span className="font-bold text-gray-800 block text-sm">🏮 {profile.shio}</span>
          <span className="text-gray-500">Energi {profile.element}</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter mb-1 font-semibold">Kekuatan Utama</span>
          <span className="font-bold text-gray-800 block text-[10px] leading-tight">Berbasis Cetak Biru {profile.hdType}</span>
        </div>
      </div>
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
        <span className="text-indigo-400 block uppercase tracking-tighter text-[10px] mb-1 font-bold">💬 Gaya Komunikasi Utama</span>
        <p className="text-[12px] text-indigo-900 leading-relaxed font-medium">
          {profile.communicationStyle}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 py-8 flex flex-col">
      <header className="text-center mb-8 no-print">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
          Cosmic Vibes
        </h1>
        <p className="text-gray-500 text-sm mt-1">Human Design Pairing</p>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        {step === 'welcome' && (
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce">
              <span className="text-4xl">🌌</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] leading-tight font-heading font-semibold text-gray-800 mb-6 h-28 flex items-center justify-center">
              <span>
                <span ref={headingRef}></span>
                <span className="cursor">|</span>
              </span>
            </h2>
            <p className="text-gray-600 mb-10 mx-auto max-w-[280px] text-sm leading-relaxed">
              Analisis mendalam berdasarkan integrasi Human Design, Astrologi, dan Metafisika Timur.
            </p>
            <button 
              onClick={() => setStep('input')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              Mulai Analisis Detil
            </button>
          </div>
        )}

        {step === 'input' && (
          <div className="animate-in fade-in duration-500">
            <PersonInput 
              label="Kandidat Pertama" 
              data={personA} 
              onChange={setPersonA}
              accentColor="text-indigo-600"
              placeholderName="Budi Santoso"
            />
            <PersonInput 
              label="Kandidat Kedua" 
              data={personB} 
              onChange={setPersonB}
              accentColor="text-rose-500"
              placeholderName="Annisa Mutiarani"
            />
            <button 
              onClick={handleReveal}
              className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-4"
            >
              Proses Peta Kosmik
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center animate-in fade-in">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-50 rounded-full opacity-10"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🔮</span>
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-700 animate-pulse">Menghitung Probabilitas Hubungan...</h3>
            <p className="text-gray-400 text-sm mt-2">Mengkombinasikan ribuan variabel energi deterministik.</p>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="animate-in zoom-in-95 fade-in duration-700 pb-10">
            <div ref={resultsRef} className="bg-[#fdfcfb] p-6 rounded-3xl border border-gray-100/50 shadow-inner">
              <div className="text-center mb-8">
                 <h1 className="text-2xl font-heading font-extrabold text-gray-900">Analisis Kompatibilitas Multidimensi</h1>
                 <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Laporan Resmi Cosmic Vibes</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-center mb-6 relative overflow-hidden border border-gray-100">
                <div className="relative z-10">
                  <div className="text-[80px] leading-none font-heading font-black text-indigo-600 mb-2 tracking-tighter">
                    {analysis.compatibility.score}<span className="text-3xl">%</span>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-gray-800 leading-tight">{analysis.compatibility.headline}</h2>
                  <div className="mt-4 flex justify-center">
                    <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
                      {analysis.compatibility.archetype}
                    </span>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-50 rounded-full opacity-50"></div>
              </div>

              <div className="space-y-6">
                <ProfileCard profile={analysis.personA} color="text-indigo-600" />
                <ProfileCard profile={analysis.personB} color="text-rose-500" />
              </div>

              <div className="bg-gray-900 text-white p-8 rounded-3xl my-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4 border-b border-white/10 pb-2">Ringkasan Esensial</h4>
                  <p className="text-[15px] leading-relaxed font-light italic text-gray-100">
                    "{analysis.compatibility.summary}"
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">✨</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm mb-6">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-lg">💬</span> Protokol Komunikasi Pasangan
                </h4>
                <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                  {analysis.compatibility.communicationAdvice}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 mb-8">
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>✅</span> Pilar Kekuatan Hubungan
                  </h4>
                  <ul className="text-[12px] text-green-900 space-y-3 font-medium">
                    {analysis.compatibility.strengths.map((s, i) => <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 block">✦</span> <span>{s}</span>
                    </li>)}
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>⚠️</span> Area Pengembangan & Tantangan
                  </h4>
                  <ul className="text-[12px] text-amber-900 space-y-3 font-medium">
                    {analysis.compatibility.challenges.map((c, i) => <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1 block">✦</span> <span>{c}</span>
                    </li>)}
                  </ul>
                </div>
              </div>
              
              <div className="text-center py-8 border-t border-gray-200 mt-8">
                <p className="text-[9px] text-gray-400 font-bold tracking-[0.4em] uppercase">Cosmic Vibes • 2026 • Verified Cosmic Pairing Report</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 no-print mt-8">
              <button 
                onClick={handleDownloadPDF} 
                disabled={isDownloading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isDownloading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Menghasilkan Laporan...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Download Laporan PDF Lengkap
                  </>
                )}
              </button>
              <button 
                onClick={reset} 
                className="w-full bg-white border border-gray-200 text-gray-500 font-bold py-4 rounded-2xl active:scale-95 transition-all text-sm"
              >
                Analisis Pasangan Lain
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-xs text-gray-400 no-print pb-10 max-w-[280px] mx-auto leading-relaxed">
        <p>© 2026 Cosmic Vibes. Algoritma deterministik kompleks.</p>
        <p className="mt-2 font-medium">Build by Haze Nightwalker</p>
        <p className="mt-2 text-[10px] opacity-70">Hasil analisis didasarkan pada perhitungan matematis dari data kelahiran dan prinsip Human Design fundamental.</p>
      </footer>
    </div>
  );
};

export default App;
