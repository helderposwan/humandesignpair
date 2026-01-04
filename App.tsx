
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
        alert("Terjadi kesalahan. Coba lagi.");
        setStep('input');
      }
    }, 1500);
  };

  const handleSaveImage = async () => {
    if (!exportRef.current || !analysis) return;
    
    setIsSaving(true);

    try {
      // Ensure fonts are ready
      if (document.fonts) {
        await document.fonts.ready;
      }

      const element = exportRef.current;
      const fileName = `Cosmic_Report_${analysis.personA.name}_${analysis.personB.name}.jpg`;

      // @ts-ignore
      const canvas = await window.html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1000,
        windowWidth: 1000, 
        onclone: (clonedDoc: Document) => {
          const el = clonedDoc.getElementById('export-container');
          if (el) {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.position = 'relative';
          }
        }
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error("Save error:", err);
      alert("Gagal menyimpan gambar. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
  };

  const DetailedProfileCard = ({ profile, color }: { profile: any, color: string }) => (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6`}>
      <header className="border-b border-gray-50 pb-4 mb-6">
        <h4 className={`text-xl font-heading font-extrabold ${color} tracking-tight`}>{profile.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peta Energi Kosmik</span>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>
      </header>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
        {[
          { label: 'Type', value: profile.hdType },
          { label: 'Profile', value: profile.hdProfile },
          { label: 'Inner Authority', value: profile.hdAuthority },
          { label: 'Definition', value: profile.hdDefinition },
          { label: 'Strategy', value: profile.hdStrategy },
          { label: 'Not-Self Theme', value: profile.hdNotSelfTheme, color: 'text-rose-400' },
        ].map((item, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.label}</span>
            <p className={`font-bold text-gray-900 text-sm ${item.color || ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Incarnation Cross</span>
        <p className="text-[11px] font-medium text-gray-700 leading-tight">{profile.hdIncarnationCross}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm">☀️</div>
          <div><span className="text-[9px] font-bold text-gray-400 uppercase block">Sun Sign</span><span className="text-xs font-bold text-gray-800">{profile.sunSign}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-sm">🏮</div>
          <div><span className="text-[9px] font-bold text-gray-400 uppercase block">Shio</span><span className="text-xs font-bold text-gray-800">{profile.shio}</span></div>
        </div>
      </div>

      <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100/50">
        <span className="text-indigo-100 block uppercase tracking-tighter text-[9px] mb-1 font-bold">💬 Gaya Komunikasi</span>
        <p className="text-[11px] text-white leading-relaxed font-medium">{profile.communicationStyle}</p>
      </div>
    </div>
  );

  const PortraitExportProfile = ({ profile, color }: { profile: any, color: string }) => (
    <div className="bg-white p-12 rounded-[5rem] border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      <header className="border-b border-gray-50 pb-8 mb-10">
        <h4 className={`text-6xl font-heading font-black ${color} tracking-tighter leading-tight break-words`}>{profile.name}</h4>
        <p className="text-[18px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-3">Energy Blueprint</p>
      </header>
      
      <div className="space-y-12 flex-1">
        {[
          { l: 'Type', v: profile.hdType },
          { l: 'Profile', v: profile.hdProfile },
          { l: 'Authority', v: profile.hdAuthority },
        ].map((item, i) => (
          <div key={i}>
            <span className="text-[15px] font-bold text-gray-300 uppercase block mb-3">{item.l}</span>
            <p className="font-bold text-gray-800 text-[36px] leading-tight break-words">{item.v}</p>
          </div>
        ))}
        <div className="pt-12 border-t border-gray-50 flex justify-between gap-12">
           <div className="flex-1">
             <span className="text-[15px] font-bold text-gray-300 uppercase block mb-2">Sun Sign</span>
             <span className="text-[28px] font-bold text-gray-700 block leading-tight">{profile.sunSign}</span>
           </div>
           <div className="flex-1">
             <span className="text-[15px] font-bold text-gray-300 uppercase block mb-2">Shio</span>
             <span className="text-[28px] font-bold text-gray-700 block leading-tight">{profile.shio}</span>
           </div>
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
            <PersonInput label="Orang Pertama" data={personA} onChange={setPersonA} accentColor="text-indigo-600" placeholderName="Budi Santoso" />
            <PersonInput label="Orang Kedua" data={personB} onChange={setPersonB} accentColor="text-rose-500" placeholderName="Annisa Mutiarani" />
            <button 
              onClick={handleReveal}
              className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-4"
            >
              Proses Peta Kosmik
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center animate-in fade-in py-10">
            <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-heading font-semibold text-gray-700">Mengkalkulasi Probabilitas...</h3>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="animate-in zoom-in-95 fade-in duration-700 pb-10">
            <div ref={resultsRef} className="bg-[#fdfcfb] p-6 rounded-3xl border border-gray-100 shadow-inner">
              <div className="text-center mb-8">
                 <h1 className="text-2xl font-heading font-extrabold text-gray-900">Hasil Analisis Hubungan</h1>
                 <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Verified Cosmic Pairing Report</p>
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
                <DetailedProfileCard profile={analysis.personA} color="text-indigo-600" />
                <DetailedProfileCard profile={analysis.personB} color="text-rose-500" />
              </div>

              <div className="bg-gray-900 text-white p-8 rounded-3xl my-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4 border-b border-white/10 pb-2">Ringkasan Esensial</h4>
                  <p className="text-[15px] leading-relaxed font-light italic text-gray-100">"{analysis.compatibility.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 mb-8">
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2"><span>✅</span> Pilar Kekuatan</h4>
                  <ul className="text-[12px] text-green-900 space-y-3 font-medium">
                    {analysis.compatibility.strengths.map((s, i) => <li key={i} className="flex items-start gap-3"><span className="text-green-500">•</span> {s}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2"><span>⚠️</span> Area Pengembangan</h4>
                  <ul className="text-[12px] text-amber-900 space-y-3 font-medium">
                    {analysis.compatibility.challenges.map((c, i) => <li key={i} className="flex items-start gap-3"><span className="text-amber-500">•</span> {c}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 no-print mt-8">
              <button 
                onClick={handleSaveImage} 
                disabled={isSaving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses Gambar...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">📥</span>
                    <span>Simpan Analisis (JPG)</span>
                  </>
                )}
              </button>
              <button onClick={reset} className="w-full bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl text-sm font-bold">Analisis Lagi</button>
            </div>

            {/* 
                ULTRA-PREMIUM EXPORT CONTAINER
                Designed to be perfectly rendered at 1000px width.
                Uses strictly relative/flex layout for absolute stability.
            */}
            <div 
              className="no-print"
              style={{ 
                height: 0, 
                overflow: 'hidden', 
                position: 'relative', 
                zIndex: -9999,
                visibility: 'hidden'
              }} 
            >
              <div 
                id="export-container"
                ref={exportRef} 
                style={{ 
                  width: '1000px', 
                  backgroundColor: '#ffffff',
                  padding: '50px',
                  position: 'relative',
                  display: 'block'
                }}
                className="font-sans"
              >
                <div className="w-full bg-white border-[30px] border-gray-50 rounded-[10rem] p-20 flex flex-col space-y-20">
                  
                  {/* Premium Header */}
                  <div className="flex justify-between items-center px-12 pt-8">
                    <div className="space-y-4">
                      <h1 className="text-9xl font-heading font-black text-gray-900 tracking-tighter leading-none">Cosmic Vibes</h1>
                      <p className="text-indigo-400 text-3xl uppercase font-bold tracking-[0.5em]">Quantum Connection Analysis</p>
                    </div>
                    <div className="w-40 h-40 rounded-full border-[12px] border-indigo-50 flex items-center justify-center text-8xl bg-white shadow-2xl">🌌</div>
                  </div>

                  {/* High-Impact Score Section */}
                  <div className="bg-gray-50 rounded-[8rem] py-24 px-20 border border-gray-100 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500"></div>
                    <p className="text-gray-400 text-xl font-black uppercase tracking-[1em] mb-10">Synergy Score</p>
                    
                    <div className="flex items-baseline justify-center mb-10">
                      <span className="text-[340px] font-heading font-black text-indigo-600 leading-none tracking-tighter">
                        {analysis.compatibility.score}
                      </span>
                      <span className="text-9xl font-black text-indigo-400 ml-6 mb-32 opacity-80">%</span>
                    </div>

                    <h2 className="text-8xl font-heading font-bold text-gray-800 text-center mb-14 leading-[1.1] tracking-tight max-w-[900px] whitespace-normal break-words">
                      {analysis.compatibility.headline}
                    </h2>
                    
                    <div className="inline-block px-20 py-10 bg-indigo-600 text-white text-[32px] font-black rounded-full uppercase tracking-[0.3em] shadow-2xl">
                      {analysis.compatibility.archetype}
                    </div>
                  </div>

                  {/* Balanced Profile Grid */}
                  <div className="grid grid-cols-2 gap-16">
                    <PortraitExportProfile profile={analysis.personA} color="text-indigo-600" />
                    <PortraitExportProfile profile={analysis.personB} color="text-rose-500" />
                  </div>

                  {/* Elegant Summary Verdict */}
                  <div className="bg-gray-900 text-white p-28 rounded-[8rem] shadow-2xl flex flex-col justify-center border border-gray-800 relative min-h-[500px]">
                    <div className="absolute top-16 left-20 opacity-10 text-[260px] leading-none font-serif text-white italic select-none">“</div>
                    <header className="mb-14 flex items-center gap-10">
                      <div className="w-24 h-[6px] bg-indigo-500"></div>
                      <h4 className="text-3xl font-bold uppercase tracking-[0.9em] text-indigo-400">The Cosmic Verdict</h4>
                    </header>
                    <p className="text-[52px] leading-[1.6] font-light italic text-gray-100 pr-12 relative z-10 tracking-tight whitespace-normal break-words">
                      {analysis.compatibility.summary}
                    </p>
                    <div className="absolute bottom-12 right-20 opacity-10 text-[260px] leading-none font-serif text-white italic rotate-180 select-none">“</div>
                  </div>

                  {/* Clean Strength List */}
                  <div className="bg-green-50/50 p-24 rounded-[8rem] border border-green-100/50 flex flex-col space-y-16">
                    <header className="flex items-center justify-center gap-12">
                      <div className="w-20 h-[3px] bg-green-200"></div>
                      <h4 className="text-4xl font-bold text-green-700 uppercase tracking-[0.7em] flex items-center gap-10">
                        <span className="text-6xl">✨</span> Core Strengths
                      </h4>
                      <div className="w-20 h-[3px] bg-green-200"></div>
                    </header>
                    <ul className="text-[46px] text-green-900 space-y-14 font-bold flex flex-col items-center text-center px-16">
                      {analysis.compatibility.strengths.slice(0, 5).map((s, i) => (
                        <li key={i} className="flex items-center gap-12 leading-[1.4] max-w-[900px] whitespace-normal break-words">
                          <span className="w-10 h-10 rounded-full bg-green-400 shrink-0 shadow-lg"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Professional Footer */}
                  <div className="text-center text-[24px] text-gray-300 font-bold uppercase tracking-[1.8em] pt-16 pb-12 border-t border-gray-50/50">
                    CosmicVibes.app
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto text-center text-[10px] text-gray-400 no-print pb-6">
        © 2026 Cosmic Vibes • Built by Haze Nightwalker
      </footer>
    </div>
  );
};

export default App;
