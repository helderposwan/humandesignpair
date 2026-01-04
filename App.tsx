
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

  const handleSaveImage = () => {
    if (!exportRef.current || !analysis) return;
    
    setIsSaving(true);
    const element = exportRef.current;
    const fileName = `Cosmic_Pairing_${analysis.personA.name}_&_${analysis.personB.name}.jpg`;

    // @ts-ignore
    window.html2canvas(element, {
      scale: 3, 
      useCORS: true,
      backgroundColor: '#fdfcfb',
      logging: false,
      width: 1280,
      height: 720,
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      setIsSaving(false);
    }).catch((err: any) => {
      console.error(err);
      setIsSaving(false);
      alert("Gagal menyimpan.");
    });
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
  };

  const ProfileCard = ({ profile, color, compact = false }: { profile: any, color: string, compact?: boolean }) => (
    <div className={`bg-white ${compact ? 'p-4' : 'p-6'} rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
      <header className="border-b border-gray-50 pb-2 mb-3">
        <h4 className={`${compact ? 'text-base' : 'text-xl'} font-heading font-extrabold ${color} truncate`}>{profile.name}</h4>
        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Energy Blueprint</p>
      </header>
      
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
        {[
          { label: 'Type', value: profile.hdType },
          { label: 'Profile', value: profile.hdProfile },
          { label: 'Authority', value: profile.hdAuthority },
          { label: 'Strategy', value: profile.hdStrategy },
        ].map((item, idx) => (
          <div key={idx} className="overflow-hidden">
            <span className="text-[7px] font-bold text-gray-300 uppercase block">{item.label}</span>
            <p className={`font-bold text-gray-800 leading-tight truncate ${compact ? 'text-[10px]' : 'text-sm'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">☀️</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">{profile.sunSign}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">🏮</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">{profile.shio}</span>
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

      <main className="flex-1">
        {step === 'welcome' && (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce text-4xl">🌌</div>
            <h2 className="text-[28px] leading-tight font-heading font-semibold text-gray-800 mb-6 h-24 flex items-center justify-center">
              <span ref={headingRef}></span><span className="cursor">|</span>
            </h2>
            <button onClick={() => setStep('input')} className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-md active:scale-95">Mulai Analisis</button>
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <PersonInput label="Kandidat Pertama" data={personA} onChange={setPersonA} accentColor="text-indigo-600" />
            <PersonInput label="Kandidat Kedua" data={personB} onChange={setPersonB} accentColor="text-rose-500" />
            <button onClick={handleReveal} className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95">Proses Peta Kosmik</button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center py-20 animate-in fade-in">
            <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-heading font-semibold text-gray-700">Mengkalkulasi Probabilitas...</h3>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="animate-in fade-in duration-700 pb-10">
            <div ref={resultsRef} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-6xl font-heading font-black text-indigo-600 mb-1">{analysis.compatibility.score}%</div>
                <h2 className="text-xl font-heading font-bold text-gray-800">{analysis.compatibility.headline}</h2>
                <span className="inline-block px-4 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase mt-2">{analysis.compatibility.archetype}</span>
              </div>
              <div className="space-y-4">
                <ProfileCard profile={analysis.personA} color="text-indigo-600" />
                <ProfileCard profile={analysis.personB} color="text-rose-500" />
              </div>
              <div className="mt-6 p-4 bg-gray-900 rounded-2xl text-white italic text-sm leading-relaxed">"{analysis.compatibility.summary}"</div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={handleSaveImage} disabled={isSaving} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                {isSaving ? "Menyimpan..." : "📥 Simpan Hasil (16:9)"}
              </button>
              <button onClick={reset} className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-medium">Reset</button>
            </div>
          </div>
        )}

        {/* CLEAN EXPORT TEMPLATE - 1280x720 Fixed Aspect */}
        {analysis && (
          <div ref={exportRef} style={{ position: 'absolute', left: '-9999px', width: '1280px', height: '720px', backgroundColor: '#fdfcfb', padding: '40px', overflow: 'hidden' }}>
            <div className="h-full bg-white rounded-[2.5rem] border border-gray-200 soft-shadow p-10 flex flex-col">
              
              {/* Top Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h1 className="text-5xl font-heading font-black text-gray-900 tracking-tighter">Cosmic Vibes</h1>
                  <p className="text-indigo-400 text-xs uppercase font-bold tracking-[0.4em]">Personal Human Design Report</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-7xl font-heading font-black text-indigo-600 leading-none">{analysis.compatibility.score}%</div>
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest mt-2 inline-block">{analysis.compatibility.archetype}</span>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-indigo-100 flex items-center justify-center text-3xl">✨</div>
                </div>
              </div>

              {/* Main Content: 2 Columns for Profiles */}
              <div className="grid grid-cols-2 gap-10 flex-1 mb-8">
                <ProfileCard profile={analysis.personA} color="text-indigo-600" compact />
                <ProfileCard profile={analysis.personB} color="text-rose-500" compact />
              </div>

              {/* Bottom Row: Summary & Advice */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-gray-900 text-white p-6 rounded-[2rem] flex flex-col justify-center">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-2 border-b border-white/10 pb-1">Analisis Hubungan</h4>
                  <p className="text-[14px] leading-relaxed font-light italic text-gray-100 line-clamp-3">"{analysis.compatibility.summary}"</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col justify-center">
                  <h4 className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-2">💡 Strategic Focus</h4>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-bold">{analysis.compatibility.communicationAdvice}</p>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em]">
                <p>Deterministic Engine v4.2 • Jovian Standards</p>
                <div className="flex gap-4">
                  <span>Verified 2026</span>
                  <span>Pairing ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto text-center text-[10px] text-gray-400 no-print pb-6">
        © 2026 Cosmic Vibes • Build by Haze Nightwalker
      </footer>
    </div>
  );
};

export default App;
