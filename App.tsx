
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
  const [isSaving, setIsSaving] = useState(false);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

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
        .to({}, { duration: 2 })
        .to(headingRef.current, {
          duration: 1,
          text: "",
          ease: "none",
        })
        .to({}, { duration: 0.5 });
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

  const handleSaveImage = () => {
    if (!exportRef.current || !analysis) return;
    
    setIsSaving(true);
    const element = exportRef.current;
    const fileName = `Hasil_CosmicVibes_${analysis.personA.name.replace(/\s+/g, '_')}_&_${analysis.personB.name.replace(/\s+/g, '_')}.jpg`;

    // Ensure element is visible enough for capturing while keeping it off-screen
    // html2canvas works best if the element is in the DOM and rendered.
    
    // @ts-ignore
    window.html2canvas(element, {
      scale: 2, 
      useCORS: true,
      backgroundColor: '#fdfcfb',
      logging: false,
      width: 1280,
      height: 720,
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      setIsSaving(false);
    }).catch((err: any) => {
      console.error("Image save error:", err);
      setIsSaving(false);
      alert("Gagal menyimpan gambar. Silakan coba lagi.");
    });
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
  };

  const ProfileCard = ({ profile, color, compact = false }: { profile: any, color: string, compact?: boolean }) => (
    <div className={`bg-white ${compact ? 'p-4' : 'p-6'} rounded-2xl border border-gray-100 shadow-sm transition-all`}>
      <header className="border-b border-gray-50 pb-3 mb-4">
        <h4 className={`${compact ? 'text-lg' : 'text-xl'} font-heading font-extrabold ${color} tracking-tight`}>{profile.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Peta Energi</span>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
      </header>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        {[
          { label: 'Type', value: profile.hdType },
          { label: 'Profile', value: profile.hdProfile },
          { label: 'Authority', value: profile.hdAuthority },
          { label: 'Definition', value: profile.hdDefinition },
          { label: 'Strategy', value: profile.hdStrategy },
          { label: 'Not-Self', value: profile.hdNotSelfTheme, color: 'text-rose-400' },
        ].map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">{item.label}</span>
            <p className={`font-bold text-gray-800 leading-tight ${compact ? 'text-[11px]' : 'text-sm'} ${item.color || ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-2.5 rounded-lg mb-4 border border-gray-100">
        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Incarnation Cross</span>
        <p className="text-[9px] font-medium text-gray-600 leading-tight">{profile.hdIncarnationCross}</p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs">☀️</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">{profile.sunSign}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">🏮</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">{profile.shio}</span>
        </div>
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
          <>
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
                </div>

                <div className="space-y-6">
                  <ProfileCard profile={analysis.personA} color="text-indigo-600" />
                  <ProfileCard profile={analysis.personB} color="text-rose-500" />
                </div>

                <div className="bg-gray-900 text-white p-8 rounded-3xl my-8 shadow-2xl relative overflow-hidden">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4 border-b border-white/10 pb-2">Ringkasan Esensial</h4>
                  <p className="text-[15px] leading-relaxed font-light italic text-gray-100">
                    "{analysis.compatibility.summary}"
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm mb-6">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="text-lg">💬</span> Protokol Komunikasi
                  </h4>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                    {analysis.compatibility.communicationAdvice}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-8">
                  <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                    <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>✅</span> Pilar Kekuatan
                    </h4>
                    <ul className="text-[12px] text-green-900 space-y-3 font-medium">
                      {analysis.compatibility.strengths.map((s, i) => <li key={i} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 block">✦</span> <span>{s}</span>
                      </li>)}
                    </ul>
                  </div>
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>⚠️</span> Area Pengembangan
                    </h4>
                    <ul className="text-[12px] text-amber-900 space-y-3 font-medium">
                      {analysis.compatibility.challenges.map((c, i) => <li key={i} className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1 block">✦</span> <span>{c}</span>
                      </li>)}
                    </ul>
                  </div>
                </div>
                
                <div className="text-center py-8 border-t border-gray-200 mt-8">
                  <p className="text-[9px] text-gray-400 font-bold tracking-[0.4em] uppercase">Cosmic Vibes • 2026 • Verified Pairing Report</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 no-print mt-8">
                <button 
                  onClick={handleSaveImage} 
                  disabled={isSaving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span>📥</span>
                      Simpan Hasil
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

            {/* Hidden Export Template - Landscape 16:9 2-Column Structure */}
            <div 
              ref={exportRef} 
              style={{ 
                position: 'absolute', 
                left: '-9999px', 
                width: '1280px', 
                height: '720px', 
                backgroundColor: '#fdfcfb',
                padding: '40px',
                overflow: 'hidden'
              }}
              className="font-sans"
            >
              <div className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-200/50 soft-shadow p-8 relative">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-heading font-black text-gray-900 tracking-tighter">Cosmic Vibes</h1>
                    <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Certified Human Design Pairing Report</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-heading font-black text-indigo-600 leading-none">
                      {analysis.compatibility.score}%
                    </div>
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest mt-2 inline-block">
                      {analysis.compatibility.archetype}
                    </span>
                  </div>
                </div>

                {/* Main Content Side-by-Side */}
                <div className="grid grid-cols-12 gap-8 flex-1">
                  {/* Profiles Column */}
                  <div className="col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <ProfileCard profile={analysis.personA} color="text-indigo-600" compact />
                      <ProfileCard profile={analysis.personB} color="text-rose-500" compact />
                    </div>
                    
                    {/* Horizontal Summary Box */}
                    <div className="bg-gray-900 text-white p-6 rounded-[2rem] flex items-center gap-6">
                      <div className="text-4xl">✨</div>
                      <div className="flex-1">
                        <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-2 border-b border-white/10 pb-1">Esensi Hubungan</h4>
                        <p className="text-[13px] leading-relaxed font-light italic text-gray-100">
                          "{analysis.compatibility.summary}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="col-span-4 flex flex-col gap-6">
                    <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 h-full flex flex-col">
                       <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span>💬</span> Protokol Komunikasi
                      </h4>
                      <p className="text-[12px] text-gray-700 leading-relaxed font-medium flex-1">
                        {analysis.compatibility.communicationAdvice}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
                        <h4 className="text-[9px] font-bold text-green-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span>✅</span> Pilar Kekuatan
                        </h4>
                        <ul className="text-[10px] text-green-900 space-y-1 font-medium">
                          {analysis.compatibility.strengths.slice(0, 2).map((s, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500">•</span> <span>{s}</span>
                          </li>)}
                        </ul>
                      </div>
                      <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                        <h4 className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span>⚠️</span> Area Pengembangan
                        </h4>
                        <ul className="text-[10px] text-amber-900 space-y-1 font-medium">
                          {analysis.compatibility.challenges.slice(0, 2).map((c, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">•</span> <span>{c}</span>
                          </li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-8 flex justify-between items-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.4em]">
                  <p>Cosmic Vibes • Deterministic Logic Engine 4.0</p>
                  <p>Verified Pairing Result • 2026</p>
                </div>
              </div>
            </div>
          </>
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
