
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BirthData, FullAnalysisResponse } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { getFullCosmicAnalysis } from './services/geminiService.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const StarField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const starCount = 100;
    const container = containerRef.current;
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.background = 'white';
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${Math.random() * 0.7}`;
      star.style.borderRadius = '50%';
      star.classList.add('star');
      container.appendChild(star);
    }

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to('.star', {
        x: (i) => x * (i % 5 + 1),
        y: (i) => y * (i % 5 + 1),
        duration: 2,
        ease: 'power2.out'
      });
    };

    // Random twinkling
    gsap.to('.star', {
      opacity: 'random(0.1, 1)',
      duration: 'random(1, 3)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        amount: 5,
        from: 'random'
      }
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if(container) container.innerHTML = ''; // Clean up
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050505] to-[#000000]" />;
};

// --- SOPHISTICATED COSMIC PORTAL PRELOADER ---
const CosmicPortalLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
        onComplete();
      }
    });

    // 1. Initialize chaotic rotation for portal rings (3D Gyroscope effect)
    gsap.set(".portal-ring", { transformOrigin: "center center" });
    gsap.to(".portal-ring", {
      rotationX: "random(0, 360)",
      rotationY: "random(0, 360)",
      rotationZ: "random(0, 360)",
      duration: "random(3, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 2. Animate Particles being sucked in
    const particles = gsap.utils.toArray('.suction-particle');
    gsap.to(particles, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 0,
      duration: 1.5,
      stagger: {
        amount: 2,
        from: "random",
        repeat: -1
      },
      ease: "power1.in"
    });

    // 3. Loading Counter Sequence
    const loadObj = { val: 0 };
    tl.to(loadObj, {
      val: 100,
      duration: 4,
      ease: "expo.inOut",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = Math.round(loadObj.val).toString().padStart(3, '0');
        }
      }
    });

    // 4. Text Glitch/Change during load
    tl.to(subTextRef.current, {
        text: "MENYINKRONKAN FREKUENSI...",
        duration: 1,
        ease: "none"
    }, 1);
    tl.to(subTextRef.current, {
        text: "MEMBUKA GERBANG...",
        duration: 1,
        ease: "none"
    }, 2.5);

    // 5. THE IMPLOSION (Black Hole Suction Exit)
    // First, text vanishes
    tl.to(textRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" }, "-=0.5");
    
    // Portal spins insanely fast and turns white
    tl.to(portalRef.current, {
        rotation: 720,
        scale: 0.1,
        duration: 0.8,
        filter: "brightness(200%) contrast(200%)", // Flash effect
        ease: "expo.in"
    });

    // Screen gets sucked into the center pixel
    tl.to(containerRef.current, {
        backgroundColor: "#000", // Ensure pitch black
        clipPath: "circle(0% at 50% 50%)", // The actual suction visual
        duration: 0.8,
        ease: "expo.inOut"
    }, "-=0.1");

  }, [onComplete]);

  // Generate particles for suction effect
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 200;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return (
      <div 
        key={i}
        className="suction-particle absolute w-1 h-1 bg-indigo-400 rounded-full blur-[1px]"
        style={{ 
          transform: `translate(${x}px, ${y}px)`, 
          opacity: 0 
        }}
      />
    );
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden"
      style={{ clipPath: "circle(150% at 50% 50%)" }} // Start full screen
    >
      {/* 3D Portal Container */}
      <div 
        ref={portalRef}
        className="relative w-64 h-64 flex items-center justify-center [perspective:1000px]"
      >
        {/* Core Singularity */}
        <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_100px_rgba(255,255,255,0.8),0_0_40px_rgba(79,70,229,1)] z-20 animate-pulse"></div>

        {/* Gyroscopic Rings */}
        <div className="portal-ring absolute inset-0 border-[2px] border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
        <div className="portal-ring absolute inset-2 border-[1px] border-purple-500/40 rounded-full border-dashed"></div>
        <div className="portal-ring absolute inset-4 border-[3px] border-transparent border-t-indigo-400/60 border-b-indigo-400/60 rounded-full"></div>
        <div className="portal-ring absolute inset-[-20px] border-[1px] border-white/10 rounded-full scale-110"></div>
        
        {/* Suction Particles */}
        {particles}
      </div>

      {/* Futuristic HUD Text */}
      <div ref={textRef} className="absolute bottom-20 flex flex-col items-center z-30">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-mono text-indigo-500 mr-2">{'>'}</span>
          <span ref={percentRef} className="text-8xl font-heading font-black text-white tracking-tighter">000</span>
          <span className="text-2xl font-bold text-indigo-500">%</span>
        </div>
        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-4"></div>
        <p ref={subTextRef} className="text-[10px] text-indigo-300 font-mono uppercase tracking-[0.4em] animate-pulse">
          INISIALISASI SISTEM...
        </p>
      </div>
    </div>
  );
};

// Reusable Dark UI Card
const GlassCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);

const ResultProfileCard = ({ profile, color }: { profile: any, color: string }) => (
  <GlassCard className="result-card hover:bg-white/10 transition-colors duration-500">
    <header className="border-b border-white/10 pb-6 mb-6">
      <h4 className={`text-4xl font-heading font-black ${color} tracking-tighter`}>{profile.name}</h4>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Cetak Biru Kosmik</span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
      </div>
    </header>
    
    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
      {[
        { label: 'Tipe', value: profile.hdType },
        { label: 'Profil', value: profile.hdProfile },
        { label: 'Otoritas', value: profile.hdAuthority },
        { label: 'Strategi', value: profile.hdStrategy },
      ].map((item, idx) => (
        <div key={idx} className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
          <p className="font-medium text-gray-100 text-sm">{item.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-black/20 p-5 rounded-2xl mb-6 border border-white/5">
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Tema Inkarnasi</span>
      <p className="text-xs text-gray-300 leading-relaxed font-light">{profile.hdIncarnationCross}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
      <div>
        <span className="text-[9px] font-bold text-gray-500 uppercase block">Zodiak</span>
        <span className="text-lg font-heading font-bold text-white">{profile.sunSign}</span>
      </div>
      <div>
        <span className="text-[9px] font-bold text-gray-500 uppercase block">Shio</span>
        <span className="text-lg font-heading font-bold text-white">{profile.shio}</span>
      </div>
    </div>
  </GlassCard>
);

// --- EXACT EXPORT COMPONENT (HIDDEN) ---
const PortraitExportProfile = ({ profile, color }: { profile: any, color: string }) => (
  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
    <header className="border-b border-gray-50 pb-5 mb-6">
      <h4 className={`text-3xl font-heading font-black ${color} tracking-tighter leading-tight break-words`}>{profile.name}</h4>
      <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1">Cetak Biru Energi</p>
    </header>
    <div className="space-y-6 flex-1">
      {[ { l: 'Tipe', v: profile.hdType }, { l: 'Profil', v: profile.hdProfile }, { l: 'Otoritas', v: profile.hdAuthority } ].map((item, i) => (
        <div key={i}>
          <span className="text-[10px] font-bold text-gray-300 uppercase block mb-1.5">{item.l}</span>
          <p className="font-bold text-gray-900 text-[20px] leading-tight break-words">{item.v}</p>
        </div>
      ))}
      <div className="pt-6 border-t border-gray-50 flex justify-between gap-6">
          <div className="flex-1"><span className="text-[10px] font-bold text-gray-300 uppercase block mb-1">Zodiak</span><span className="text-[16px] font-bold text-gray-700 block leading-tight">{profile.sunSign}</span></div>
          <div className="flex-1"><span className="text-[10px] font-bold text-gray-300 uppercase block mb-1">Shio</span><span className="text-[16px] font-bold text-gray-700 block leading-tight">{profile.shio}</span></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [step, setStep] = useState<'welcome' | 'input' | 'loading' | 'results'>('welcome');
  const [personA, setPersonA] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [personB, setPersonB] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Intro complete handler
  const handleIntroComplete = () => {
    setIsLoadingApp(false);
    // Animate the app entrance
    gsap.fromTo(appContainerRef.current, 
      { scale: 1.5, opacity: 0, filter: 'blur(20px)' }, 
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: "power3.out" }
    );
  };

  // Welcome Animation (Triggered after loading)
  useEffect(() => {
    if (!isLoadingApp && step === 'welcome' && headingRef.current) {
      const phrases = [
        "Buka Rahasia Koneksi Kuantummu.",
        "Selaraskan Frekuensi Kosmikmu.",
        "Jelajahi Sinergi Human Design."
      ];
      
      const tl = gsap.timeline({ repeat: -1 });
      phrases.forEach((phrase) => {
        tl.to(headingRef.current, { duration: 2, text: phrase, ease: "none" })
          .to({}, { duration: 1.5 })
          .to(headingRef.current, { duration: 0.8, text: "", ease: "none" })
          .to({}, { duration: 0.2 });
      });
      return () => { tl.kill(); };
    }
  }, [step, isLoadingApp]);

  // Results Entrance Animation
  useLayoutEffect(() => {
    if (step === 'results' && resultsContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.result-hero', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out' });
        gsap.from('.result-card', { scrollTrigger: { trigger: '.result-cards-container', start: 'top 80%' }, y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out' });
        gsap.from('.cosmic-verdict', { scrollTrigger: { trigger: '.cosmic-verdict', start: 'top 85%' }, scale: 0.9, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' });
      }, resultsContainerRef);
      return () => ctx.revert();
    }
  }, [step, analysis]);

  const handleReveal = async () => {
    if (!personA.name || !personB.name || !personA.date || !personB.date || !personA.time || !personB.time) {
      alert("Mohon lengkapi data kelahiran untuk melanjutkan.");
      return;
    }
    setStep('loading');
    setTimeout(async () => {
      try {
        const result = await getFullCosmicAnalysis(personA, personB);
        setAnalysis(result);
        setStep('results');
      } catch (error: any) {
        setStep('input');
      }
    }, 2000);
  };

  const handleSaveImage = async () => {
    if (!exportRef.current || !analysis) return;
    setIsSaving(true);
    try {
      if (document.fonts) await document.fonts.ready;
      const element = exportRef.current;
      const fileName = `Laporan_Kosmik_${analysis.personA.name}_${analysis.personB.name}.jpg`;
      // @ts-ignore
      const canvas = await window.html2canvas(element, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, width: 1000, windowWidth: 1000,
        onclone: (clonedDoc: Document) => {
          const el = clonedDoc.getElementById('export-container');
          if (el) { el.style.display = 'block'; el.style.visibility = 'visible'; el.style.opacity = '1'; }
        }
      });
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white">
      {isLoadingApp && <CosmicPortalLoader onComplete={handleIntroComplete} />}
      
      {/* Main App Content - Initially Hidden or blurred */}
      <div ref={appContainerRef} className={`${isLoadingApp ? 'opacity-0' : 'opacity-100'}`}>
        <StarField />

        <div className="max-w-2xl mx-auto px-6 py-12 relative z-10 flex flex-col min-h-screen">
          <header className="text-center mb-16 no-print">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              COSMIC VIBES
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.4em]">Laboratorium Sinergi Kuantum</p>
          </header>

          <main className="flex-1 flex flex-col justify-center">
            {step === 'welcome' && (
              <div className="text-center space-y-12">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[50px] opacity-40 animate-pulse"></div>
                  <div className="relative w-full h-full bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-6xl shadow-2xl">
                    🌌
                  </div>
                </div>
                
                <div className="h-32 flex items-center justify-center">
                  <h2 className="text-3xl md:text-4xl font-heading font-light text-white leading-tight">
                    <span ref={headingRef}></span>
                    <span className="cursor">|</span>
                  </h2>
                </div>

                <button 
                  onClick={() => setStep('input')}
                  className="group relative px-8 py-5 bg-white text-black font-heading font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors">MULAI ANALISIS</span>
                </button>
              </div>
            )}

            {step === 'input' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <PersonInput label="Orang Pertama" data={personA} onChange={setPersonA} accentColor="text-indigo-400" placeholderName="Masukkan Nama" />
                <PersonInput label="Orang Kedua" data={personB} onChange={setPersonB} accentColor="text-rose-400" placeholderName="Masukkan Nama" />
                <button 
                  onClick={handleReveal}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold tracking-widest text-lg rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] active:scale-95 border border-indigo-400/30"
                >
                  PROSES DATA
                </button>
              </div>
            )}

            {step === 'loading' && (
               <div className="flex flex-col items-center justify-center h-[50vh]">
                 <div className="relative w-24 h-24 mb-8">
                   <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
                   <div className="absolute inset-4 border-b-4 border-rose-500 rounded-full animate-spin [animation-duration:2s]"></div>
                 </div>
                 <h3 className="text-xl font-heading font-light tracking-[0.2em] animate-pulse">MENGHITUNG SINERGI...</h3>
               </div>
            )}

            {step === 'results' && analysis && (
              <div ref={resultsContainerRef} className="pb-20">
                {/* Hero Score */}
                <div className="result-hero mb-12 text-center relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 blur-[80px] rounded-full z-[-1]"></div>
                  <div className="inline-block relative">
                    <span className="text-[140px] leading-none font-heading font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-tighter">
                      {analysis.compatibility.score}
                    </span>
                    <span className="absolute top-4 -right-8 text-4xl font-bold text-indigo-400">%</span>
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mt-4 mb-2">
                    {analysis.compatibility.headline}
                  </h2>
                  <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300">
                    {analysis.compatibility.archetype}
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="result-cards-container grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <ResultProfileCard profile={analysis.personA} color="text-indigo-400" />
                  <ResultProfileCard profile={analysis.personB} color="text-rose-400" />
                </div>

                {/* Verdict */}
                <div className="cosmic-verdict relative mb-12 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-[2rem] opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                  <GlassCard className="relative bg-[#0a0a0a]">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6 text-center">Kesimpulan Kosmik</h4>
                    <p className="text-xl md:text-2xl font-light italic text-center text-gray-200 leading-relaxed">
                      "{analysis.compatibility.summary}"
                    </p>
                  </GlassCard>
                </div>

                {/* Analysis Lists */}
                <div className="grid gap-6 mb-12">
                   <GlassCard className="border-green-500/20 bg-green-900/10">
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="text-xl">✨</span> Titik Resonansi
                      </h4>
                      <ul className="space-y-4">
                        {analysis.compatibility.strengths.map((s, i) => (
                          <li key={i} className="flex gap-4 text-sm text-green-100 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0 shadow-[0_0_8px_currentColor]"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                   </GlassCard>
                   
                   <GlassCard className="border-amber-500/20 bg-amber-900/10">
                      <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="text-xl">⚡</span> Titik Gesekan
                      </h4>
                      <ul className="space-y-4">
                        {analysis.compatibility.challenges.map((c, i) => (
                          <li key={i} className="flex gap-4 text-sm text-amber-100 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0 shadow-[0_0_8px_currentColor]"></span>
                            {c}
                          </li>
                        ))}
                      </ul>
                   </GlassCard>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 no-print">
                  <button 
                    onClick={handleSaveImage} 
                    disabled={isSaving}
                    className="w-full py-6 bg-white text-black hover:bg-gray-200 font-bold rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? "MENYUSUN DATA KUANTUM..." : "UNDUH LAPORAN KOSMIK (JPG)"}
                  </button>
                  <button 
                    onClick={reset} 
                    className="w-full py-4 text-gray-500 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors"
                  >
                    Analisis Pasangan Baru
                  </button>
                </div>
              </div>
            )}
          </main>
          
          <footer className="mt-auto text-center py-6 border-t border-white/5 no-print">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
              © 2026 Cosmic Vibes • Dibangun oleh Haze Nightwalker
            </p>
          </footer>
        </div>

        {/* 
            HIDDEN EXPORT CONTAINER 
            Kept strictly in "Light Mode" styles as requested for the generated JPG.
            Do not modify styles here to match Dark Mode.
        */}
        <div className="no-print" style={{ height: 0, overflow: 'hidden', position: 'relative', zIndex: -9999, visibility: 'hidden' }}>
          <div id="export-container" ref={exportRef} style={{ width: '1000px', backgroundColor: '#ffffff', padding: '50px', position: 'relative', display: 'block' }} className="font-sans">
            <div className="w-full bg-white border-[2px] border-gray-50 rounded-[6rem] p-16 flex flex-col space-y-12">
              <div className="flex justify-between items-center px-4">
                <div className="space-y-2">
                  <h1 className="text-7xl font-heading font-black text-[#1e293b] tracking-tighter leading-none">Cosmic Vibes</h1>
                  <p className="text-indigo-400 text-xl uppercase font-bold tracking-[0.3em]">Laporan Sinergi Kuantum</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-[#f8faff] shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden"><span className="text-3xl">🌌</span></div>
              </div>
              <div className="bg-[#f8faff] rounded-[5rem] py-16 px-12 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 to-rose-400"></div>
                <p className="text-gray-400 text-[13px] font-black uppercase tracking-[0.5em] mb-8">Skor Kompatibilitas</p>
                <div className="flex items-baseline justify-center mb-10">
                  <span className="text-[260px] font-heading font-bold text-[#4f46e5] leading-none tracking-tighter">{analysis?.compatibility.score}</span>
                  <span className="text-7xl font-black text-[#4f46e5] ml-4 mb-20 opacity-70">%</span>
                </div>
                <h2 className="text-6xl font-heading font-bold text-[#1e293b] text-center mb-10 leading-tight tracking-tight max-w-[850px] whitespace-normal break-words">{analysis?.compatibility.headline}</h2>
                <div className="inline-block px-14 py-6 bg-[#4f46e5] text-white text-[18px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg">{analysis?.compatibility.archetype}</div>
              </div>
              <div className="grid grid-cols-2 gap-10">
                {analysis && <PortraitExportProfile profile={analysis.personA} color="text-indigo-600" />}
                {analysis && <PortraitExportProfile profile={analysis.personB} color="text-rose-500" />}
              </div>
              <div className="bg-[#111827] text-white p-20 rounded-[4rem] flex flex-col justify-center relative min-h-[400px]">
                <div className="absolute top-12 left-12 opacity-20 text-[100px] leading-none font-serif text-indigo-400 select-none rotate-12">“</div>
                <header className="mb-10 flex items-center gap-6"><div className="w-12 h-[2px] bg-indigo-500"></div><h4 className="text-[14px] font-bold uppercase tracking-[0.4em] text-indigo-400">Kesimpulan Kosmik</h4></header>
                <p className="text-[34px] leading-[1.6] font-light italic text-gray-100 pr-10 relative z-10 tracking-tight whitespace-normal break-words">{analysis?.compatibility.summary}</p>
                <div className="absolute bottom-8 right-12 opacity-20 text-[100px] leading-none font-serif text-indigo-400 select-none rotate-[192deg]">“</div>
              </div>
              <div className="bg-[#f0fdf4] p-16 rounded-[4rem] flex flex-col items-center">
                <header className="flex items-center gap-8 mb-10"><div className="w-12 h-[1px] bg-green-200"></div><h4 className="text-[16px] font-bold text-green-700 uppercase tracking-[0.4em] flex items-center gap-4"><span className="text-2xl">✨</span> Pilar Kekuatan Utama</h4><div className="w-12 h-[1px] bg-green-200"></div></header>
                <ul className="text-[30px] text-green-900 space-y-8 font-bold text-center px-10">
                  {analysis?.compatibility.strengths.slice(0, 3).map((s, i) => (<li key={i} className="flex items-center gap-6 leading-tight whitespace-normal break-words"><span className="w-4 h-4 rounded-full bg-green-400 shrink-0"></span>{s}</li>))}
                </ul>
              </div>
              <div className="text-center text-[13px] text-gray-300 font-bold uppercase tracking-[0.8em] pt-12">CosmicVibes.app</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
