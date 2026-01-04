
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
      scale: 2, 
      useCORS: true,
      backgroundColor: '#fdfcfb',
      logging: false,
      width: 1000,
      height: 1250, 
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

  const DetailedProfileCard = ({ profile, color }: { profile: any, color: string }) => (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
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
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      <header className="border-b border-gray-50 pb-3 mb-4">
        <h4 className={`text-xl font-heading font-black ${color} truncate`}>{profile.name}</h4>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Energy Profile</p>
      </header>
      
      <div className="space-y-3 flex-1">
        {[
          { l: 'Type', v: profile.hdType },
          { l: 'Profile', v: profile.hdProfile },
          { l: 'Authority', v: profile.hdAuthority },
          { l: 'Definition', v: profile.hdDefinition },
        ].map((item, i) => (
          <div key={i} className="min-w-0">
            <span className="text-[8px] font-bold text-gray-300 uppercase block mb-0.5">{item.l}</span>
            <p className="font-bold text-gray-800 text-[12px] leading-tight truncate">{item.v}</p>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
           <div>
             <span className="text-[8px] font-bold text-gray-300 uppercase block">Sun</span>
             <span className="text-[10px] font-bold text-gray-600">{profile.sunSign}</span>
           </div>
           <div>
             <span className="text-[8px] font-bold text-gray-300 uppercase block">Shio</span>
             <span className="text-[10px] font-bold text-gray-600">{profile.shio}</span>
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
                {isSaving ? "Menyimpan..." : "📥 Simpan Hasil"}
              </button>
              <button onClick={reset} className="w-full bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl text-sm font-bold">Analisis Pasangan Lain</button>
            </div>

            {/* EXPORT TEMPLATE (4:5 - 1000x1250) */}
            <div 
              ref={exportRef} 
              style={{ 
                position: 'absolute', 
                left: '-9999px', 
                width: '1000px', 
                height: '1250px', 
                backgroundColor: '#fdfcfb',
                padding: '40px',
                overflow: 'hidden'
              }}
              className="font-sans"
            >
              <div className="h-full bg-white rounded-[4rem] border border-gray-200 shadow-2xl p-12 flex flex-col relative space-y-6">
                <div className="flex justify-between items-center px-4">
                  <div>
                    <h1 className="text-5xl font-heading font-black text-gray-900 tracking-tighter">Cosmic Vibes</h1>
                    <p className="text-indigo-400 text-xs uppercase font-bold tracking-[0.5em] mt-1">Verification CVHD-{(analysis.compatibility.score * 1234).toString(16).toUpperCase()}</p>
                  </div>
                  <div className="w-20 h-20 rounded-full border-[6px] border-indigo-50 flex items-center justify-center text-4xl bg-white shadow-inner">🌌</div>
                </div>

                <div className="text-center bg-gray-50 rounded-[3rem] py-8 px-8 border border-gray-100 relative overflow-hidden shadow-sm">
                  <div className="text-[96px] font-heading font-black text-indigo-600 leading-none mb-1">{analysis.compatibility.score}%</div>
                  <h2 className="text-3xl font-heading font-bold text-gray-800 mb-3">{analysis.compatibility.headline}</h2>
                  <span className="px-6 py-2 bg-indigo-600 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                    {analysis.compatibility.archetype}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 h-[340px]">
                  <PortraitExportProfile profile={analysis.personA} color="text-indigo-600" />
                  <PortraitExportProfile profile={analysis.personB} color="text-rose-500" />
                </div>

                <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 mb-3 border-b border-white/10 pb-1">Ringkasan Esensial</h4>
                  <p className="text-[16px] leading-relaxed font-light italic text-gray-100">
                    "{analysis.compatibility.summary}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                  <div className="bg-green-50 p-8 rounded-[3rem] border border-green-100 flex flex-col">
                    <h4 className="text-[11px] font-bold text-green-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><span>✅</span> Pilar Kekuatan</h4>
                    <ul className="text-[13px] text-green-900 space-y-4 font-bold flex-1">
                      {analysis.compatibility.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-1 leading-tight">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 flex flex-col">
                    <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><span>⚠️</span> Area Pengembangan</h4>
                    <ul className="text-[13px] text-amber-900 space-y-4 font-bold flex-1">
                      {analysis.compatibility.challenges.slice(0, 3).map((c, i) => (
                        <li key={i} className="flex items-start gap-1 leading-tight">• {c}</li>
                      ))}
                    </ul>
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
