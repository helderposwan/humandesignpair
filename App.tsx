
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { BirthData, FullAnalysisResponse } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { getFullCosmicAnalysis } from './services/geminiService.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// --- CUSTOM CURSOR (OPTIMIZED) ---
const CustomCursor = React.memo(() => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // OPTIMIZATION: Do not attach listeners on mobile/touch devices to save CPU
    const isMobile = window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // PERFORMANCE: Use quickTo for high-frequency updates (mouse move)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleHover = () => cursor.classList.add('hovered');
    const handleLeave = () => cursor.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);
    
    const addListeners = () => {
      const hoverables = document.querySelectorAll('button, a, input, .hover-trigger');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleLeave);
      });
    };

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block"></div>;
});

// --- GALAXY PARALLAX BACKGROUND (OPTIMIZED) ---
const GalaxyBackground = React.memo(() => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refSmall = useRef<HTMLDivElement>(null);
  const refMedium = useRef<HTMLDivElement>(null);
  const refLarge = useRef<HTMLDivElement>(null);

  // Generate stars once using useMemo to avoid recalculation
  // OPTIMIZATION: Reduce star count significantly on mobile for 4GB RAM devices
  const stars = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // 30% density on mobile, 100% on desktop
    const density = isMobile ? 0.3 : 1.0; 

    const generate = (count: number, sizeRange: [number, number], colorBase: string) => {
      const adjustedCount = Math.floor(count * density);
      return Array.from({ length: adjustedCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        opacity: Math.random() * 0.7 + 0.3,
        animDuration: Math.random() * 3 + 2,
        animDelay: Math.random() * 5,
        color: Math.random() > 0.8 ? '#a5b4fc' : (Math.random() > 0.8 ? '#67e8f9' : colorBase) // Mix of Indigo, Cyan, White
      }));
    };

    return {
      small: generate(200, [0.5, 1.5], '#ffffff'),
      medium: generate(50, [1.5, 2.5], '#e0e7ff'),
      large: generate(15, [2.5, 4], '#c7d2fe')
    };
  }, []);

  useLayoutEffect(() => {
    // OPTIMIZATION: Completely disable Parallax Mouse Listeners on Mobile
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return; 

    const ctx = gsap.context(() => {
      // Parallax Mouse Movement (Desktop Only)
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX - window.innerWidth / 2);
        const y = (e.clientY - window.innerHeight / 2);

        // Move layers at different speeds (Parallax)
        gsap.to(refSmall.current, { x: x * 0.02, y: y * 0.02, duration: 1, ease: "power2.out" });
        gsap.to(refMedium.current, { x: x * 0.04, y: y * 0.04, duration: 1, ease: "power2.out" });
        gsap.to(refLarge.current, { x: x * 0.08, y: y * 0.08, duration: 1, ease: "power2.out" });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, refContainer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={refContainer} className="fixed inset-0 z-[0] overflow-hidden bg-[#020205] pointer-events-none">
      {/* Deep Galaxy Gradient Nebula */}
      <div className="absolute inset-0 opacity-40" 
           style={{ background: 'radial-gradient(circle at 50% 120%, #2e1065 0%, #0f172a 40%, #000000 80%)' }}></div>
      <div className="absolute inset-0 opacity-20" 
           style={{ background: 'radial-gradient(circle at 20% 20%, #312e81 0%, transparent 50%)' }}></div>

      {/* Parallax Layers - transform only applied on desktop via GSAP */}
      <div ref={refSmall} className="absolute inset-[-100px] will-change-transform">
        {stars.small.map(s => (
          <div key={`s-${s.id}`} className="absolute rounded-full star-animate"
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>

      <div ref={refMedium} className="absolute inset-[-100px] will-change-transform">
        {stars.medium.map(s => (
          <div key={`m-${s.id}`} className="absolute rounded-full star-animate shadow-[0_0_3px_rgba(255,255,255,0.4)]"
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>

      <div ref={refLarge} className="absolute inset-[-100px] will-change-transform">
        {stars.large.map(s => (
          <div key={`l-${s.id}`} className="absolute rounded-full star-animate shadow-[0_0_8px_rgba(165,180,252,0.6)]"
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>
      
      {/* Subtle Dust/Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
});

// --- PRELOADER ---
const CosmicPortalLoader = React.memo(({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
        onComplete: () => {
            // Force display none before calling complete to prevent flash
            if (containerRef.current) containerRef.current.style.display = 'none';
            onComplete();
        }
        });

        gsap.set(".portal-ring", { transformOrigin: "center center" });
        gsap.to(".portal-ring", { rotationX: "random(0, 360)", rotationY: "random(0, 360)", rotationZ: "random(0, 360)", duration: "random(3, 6)", repeat: -1, yoyo: true, ease: "sine.inOut" });
        
        const particles = gsap.utils.toArray('.suction-particle');
        gsap.to(particles, { x: 0, y: 0, opacity: 1, scale: 0, duration: 1.5, stagger: { amount: 2, from: "random", repeat: -1 }, ease: "power1.in" });

        const loadObj = { val: 0 };
        tl.to(loadObj, { val: 100, duration: 4, ease: "expo.inOut", onUpdate: () => { if (percentRef.current) percentRef.current.innerText = Math.round(loadObj.val).toString().padStart(3, '0'); }});
        tl.to(subTextRef.current, { text: "MENYINKRONKAN FREKUENSI...", duration: 1, ease: "none" }, 1);
        tl.to(subTextRef.current, { text: "MEMBUKA GERBANG...", duration: 1, ease: "none" }, 2.5);

        tl.to(textRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" }, "-=0.5");
        tl.to(portalRef.current, { rotation: 720, scale: 0.1, duration: 0.8, filter: "brightness(200%) contrast(200%)", ease: "expo.in" });
        tl.to(containerRef.current, { backgroundColor: "#000", clipPath: "circle(0% at 50% 50%)", duration: 0.8, ease: "expo.inOut" }, "-=0.1");
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 200;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return <div key={i} className="suction-particle absolute w-1 h-1 bg-indigo-400 rounded-full blur-[1px]" style={{ transform: `translate(${x}px, ${y}px)`, opacity: 0 }} />;
  });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden" style={{ clipPath: "circle(150% at 50% 50%)" }}>
      <div ref={portalRef} className="relative w-64 h-64 flex items-center justify-center [perspective:1000px]">
        <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_100px_rgba(255,255,255,0.8),0_0_40px_rgba(79,70,229,1)] z-20 animate-pulse"></div>
        <div className="portal-ring absolute inset-0 border-[2px] border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
        <div className="portal-ring absolute inset-2 border-[1px] border-purple-500/40 rounded-full border-dashed"></div>
        <div className="portal-ring absolute inset-4 border-[3px] border-transparent border-t-indigo-400/60 border-b-indigo-400/60 rounded-full"></div>
        <div className="portal-ring absolute inset-[-20px] border-[1px] border-white/10 rounded-full scale-110"></div>
        {particles}
      </div>
      <div ref={textRef} className="absolute bottom-20 flex flex-col items-center z-30">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-mono text-indigo-500 mr-2">{'>'}</span>
          <span ref={percentRef} className="text-8xl font-heading font-black text-white tracking-tighter">000</span>
          <span className="text-2xl font-bold text-indigo-500">%</span>
        </div>
        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-4"></div>
        <p ref={subTextRef} className="text-[10px] text-indigo-300 font-mono uppercase tracking-[0.4em] animate-pulse">INISIALISASI SISTEM...</p>
      </div>
    </div>
  );
});

// --- LAYOUT COMPONENTS ---
// UPDATED: Use 100dvh for mobile viewport consistency
const Section = React.memo(({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <section className={`min-h-[100dvh] w-full flex flex-col justify-center px-6 md:px-24 py-16 md:py-20 ${className} relative z-10`}>
    {children}
  </section>
));

const RevealText = React.memo(({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const el = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if(el.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(el.current, 
          { y: 100, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, delay, ease: "power4.out" }
        );
      }, el);
      return () => ctx.revert();
    }
  }, [delay]);
  return <div className={`overflow-hidden ${className}`}><div ref={el}>{text}</div></div>;
});

// --- DATA DISPLAY COMPONENTS ---
const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className="border-b border-white/10 py-5 flex justify-between items-baseline group hover:bg-white/5 transition-colors px-4 -mx-4">
    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</span>
    <span className="text-lg md:text-xl font-medium text-white text-right">{value}</span>
  </div>
);

// --- EXACT EXPORT COMPONENT (UNCHANGED) ---
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
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  const handleIntroComplete = useCallback(() => {
    setIsLoadingApp(false);
  }, []);

  // Use Effect for reliable entry animation after loading state changes
  useEffect(() => {
    if (!isLoadingApp && appContainerRef.current) {
      gsap.fromTo(appContainerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }
  }, [isLoadingApp]);

  useLayoutEffect(() => {
    if (step === 'results' && resultsRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".res-title", { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" });
        gsap.from(".res-card", { y: 50, opacity: 0, duration: 1, stagger: 0.2, delay: 0.3, ease: "power3.out" });
        gsap.from(".score-text", { scale: 0.5, opacity: 0, duration: 1.5, delay: 0.5, ease: "elastic.out(1, 0.5)" });
      }, resultsRef);
      return () => ctx.revert();
    }
  }, [step]);

  const handleReveal = async () => {
    if (!personA.name || !personB.name || !personA.date || !personB.date || !personA.time || !personB.time) {
      alert("Mohon lengkapi seluruh data.");
      return;
    }
    setStep('loading');
    setTimeout(async () => {
      try {
        const result = await getFullCosmicAnalysis(personA, personB);
        setAnalysis(result);
        setStep('results');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        setStep('input');
      }
    }, 2500);
  };

  const handleSaveImage = async () => {
    if (!exportRef.current || !analysis) return;
    setIsSaving(true);
    try {
      if (document.fonts) await document.fonts.ready;
      const element = exportRef.current;
      const fileName = `Cosmic_Report_${analysis.personA.name}.jpg`;
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
    <div className="relative min-h-[100dvh] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden flex flex-col">
      <CustomCursor />
      
      {/* GALAXY PARALLAX BACKGROUND */}
      <GalaxyBackground />
      
      {isLoadingApp && <CosmicPortalLoader onComplete={handleIntroComplete} />}
      
      {/* HEADER: Relative on Mobile, Fixed on Desktop */}
      <div className="relative md:fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-40 pointer-events-none mix-blend-difference shrink-0">
        <div className="flex flex-col">
          <span className="font-heading font-black text-xl md:text-2xl tracking-tighter">COSMIC VIBES</span>
          <span className="text-[8px] md:text-[10px] font-mono tracking-widest opacity-60">SYSTEM v2.0</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-widest">ONLINE</span>
        </div>
      </div>

      <div 
        ref={appContainerRef} 
        className="relative z-10 opacity-0 flex-1"
      >
        {step === 'welcome' && (
          <Section className="items-center text-center justify-center">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <RevealText text="QUANTUM" className="text-[3.5rem] leading-[1] md:text-[10rem] font-heading font-black md:leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500" />
              <RevealText text="SYNERGY" delay={0.1} className="text-[3.5rem] leading-[1] md:text-[10rem] font-heading font-black md:leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-800" />
              
              <p className="mt-8 text-[10px] md:text-lg font-mono text-indigo-300 tracking-[0.2em] md:tracking-[0.5em] uppercase opacity-80 max-w-xl mx-auto px-4">
                Analisis kecocokan berbasis Human Design & Algoritma Kosmik
              </p>

              <div className="mt-12 md:mt-20 flex justify-center">
                <button 
                  onClick={() => setStep('input')}
                  className="group relative px-8 py-4 md:px-12 md:py-6 overflow-hidden rounded-full bg-white text-black font-bold tracking-widest text-[10px] md:text-sm transition-all hover:scale-105 hover:bg-indigo-50"
                >
                   <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                     MULAI ANALISIS <span className="text-lg md:text-xl">→</span>
                   </span>
                </button>
              </div>
            </div>
          </Section>
        )}

        {step === 'input' && (
          <Section className="py-24 md:py-20">
            <div className="max-w-7xl mx-auto w-full">
              
              <div className="mb-8 md:mb-20 text-center">
                <h2 className="text-3xl md:text-6xl font-heading font-black tracking-tight leading-tight">
                  INPUT DATA <span className="text-indigo-500">.</span>
                </h2>
                <p className="mt-2 md:mt-4 text-gray-400 text-[10px] md:text-sm font-mono tracking-widest uppercase opacity-60">
                  Masukkan detail kelahiran untuk kalkulasi presisi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative">
                <PersonInput index={1} label="SUBJEK ALPHA" data={personA} onChange={setPersonA} accentColor="text-indigo-400" placeholderName="NAMA ALPHA" />
                <PersonInput index={2} label="SUBJEK BETA" data={personB} onChange={setPersonB} accentColor="text-rose-400" placeholderName="NAMA BETA" />
              </div>
              
              <div className="mt-12 md:mt-20 flex flex-col md:flex-row justify-end items-center">
                <button 
                  onClick={handleReveal}
                  className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 md:px-12 py-5 md:py-6 text-sm md:text-lg font-bold text-white transition-all duration-300 bg-white/5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-transparent focus:outline-none hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 backdrop-blur-md"
                >
                  <span className="mr-4 tracking-widest">PROSES DATA</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
            </div>
          </Section>
        )}

        {step === 'loading' && (
          <div className="h-[100dvh] flex flex-col items-center justify-center">
             <div className="text-4xl md:text-9xl font-heading font-black animate-pulse tracking-tighter">
                PROCESSING
             </div>
             <div className="mt-4 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[1em] text-indigo-400 text-center px-4">
               DECODING CELESTIAL MECHANICS
             </div>
          </div>
        )}

        {step === 'results' && analysis && (
          <div ref={resultsRef} className="pt-10 md:pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            {/* Same Results Code ... (kept exactly as requested for visual fidelity) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24 items-end">
              <div className="lg:col-span-8">
                <h2 className="res-title text-4xl md:text-8xl font-heading font-black leading-[0.9] tracking-tighter mb-6 break-words">
                  {analysis.compatibility.headline.toUpperCase()}
                </h2>
                <div className="res-title flex flex-wrap gap-4">
                   <span className="px-3 md:px-4 py-2 border border-indigo-500/50 rounded-full text-indigo-300 text-[10px] md:text-xs font-bold tracking-widest uppercase bg-indigo-500/10">
                     {analysis.compatibility.archetype}
                   </span>
                   <span className="px-3 md:px-4 py-2 border border-white/20 rounded-full text-gray-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                     MATCH REPORT #8829
                   </span>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end mt-8 lg:mt-0">
                <div className="score-text relative">
                  <span className="text-[8rem] md:text-[12rem] leading-[0.8] font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-white block">
                    {analysis.compatibility.score}
                  </span>
                  <span className="text-2xl md:text-4xl font-bold text-gray-500 absolute top-0 right-0">%</span>
                </div>
                <p className="text-left lg:text-right text-[10px] md:text-xs font-mono text-gray-400 mt-4 max-w-[200px]">
                  TINGKAT RESONANSI ENERGI BERDASARKAN PARAMETER HUMAN DESIGN
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               <div className="res-card group relative p-8 md:p-12 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-colors duration-500">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="text-4xl md:text-6xl font-heading">01</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-indigo-400 mb-8 tracking-tight">{analysis.personA.name}</h3>
                  <div className="space-y-2">
                     <DetailRow label="TYPE" value={analysis.personA.hdType} />
                     <DetailRow label="PROFILE" value={analysis.personA.hdProfile} />
                     <DetailRow label="AUTHORITY" value={analysis.personA.hdAuthority} />
                     <DetailRow label="SUN SIGN" value={analysis.personA.sunSign} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-gray-400 leading-relaxed font-mono">
                      {analysis.personA.hdIncarnationCross}
                    </p>
                  </div>
               </div>

               <div className="res-card group relative p-8 md:p-12 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-rose-500/30 transition-colors duration-500">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="text-4xl md:text-6xl font-heading">02</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-rose-400 mb-8 tracking-tight">{analysis.personB.name}</h3>
                  <div className="space-y-2">
                     <DetailRow label="TYPE" value={analysis.personB.hdType} />
                     <DetailRow label="PROFILE" value={analysis.personB.hdProfile} />
                     <DetailRow label="AUTHORITY" value={analysis.personB.hdAuthority} />
                     <DetailRow label="SUN SIGN" value={analysis.personB.sunSign} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5">
                     <p className="text-xs text-gray-400 leading-relaxed font-mono">
                      {analysis.personB.hdIncarnationCross}
                    </p>
                  </div>
               </div>
            </div>

            <div className="res-card mb-8 p-8 md:p-16 rounded-[2rem] bg-gradient-to-br from-[#0f0f0f] to-[#050505] border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
               <h4 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-8">VERDICT ANALISIS</h4>
               <p className="text-xl md:text-4xl font-light leading-relaxed text-white">
                 "{analysis.compatibility.summary}"
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
               <div className="res-card p-8 md:p-10 rounded-[2rem] bg-[#080808] border-l-2 border-green-500/50">
                  <h4 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> RESONANSI
                  </h4>
                  <ul className="space-y-4">
                    {analysis.compatibility.strengths.map((s, i) => (
                      <li key={i} className="text-gray-300 text-sm md:text-base border-b border-white/5 pb-3 last:border-0">{s}</li>
                    ))}
                  </ul>
               </div>
               <div className="res-card p-8 md:p-10 rounded-[2rem] bg-[#080808] border-l-2 border-amber-500/50">
                  <h4 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span> FRIKSI
                  </h4>
                  <ul className="space-y-4">
                    {analysis.compatibility.challenges.map((c, i) => (
                      <li key={i} className="text-gray-300 text-sm md:text-base border-b border-white/5 pb-3 last:border-0">{c}</li>
                    ))}
                  </ul>
               </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-6 justify-between items-center border-t border-white/10 pt-12 pb-12 md:pb-0">
               <button onClick={reset} className="text-sm font-bold tracking-widest text-gray-500 hover:text-white transition-colors uppercase py-4">
                 ← Analisis Baru
               </button>
               <button 
                  onClick={handleSaveImage} 
                  disabled={isSaving}
                  className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-indigo-50 transition-transform active:scale-95 disabled:opacity-50"
               >
                 {isSaving ? "GENERATING..." : "DOWNLOAD REPORT"}
               </button>
            </div>

          </div>
        )}

        {/* FOOTER: Relative on Mobile, Fixed on Desktop */}
        <footer className="relative md:fixed bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end pointer-events-none mix-blend-difference z-40 shrink-0 mt-8 md:mt-0">
           <div className="text-[8px] md:text-[10px] font-mono opacity-50">
             ©2026 COSMIC VIBES<br/>QUANTUM SYNERGY LAB
           </div>
           <div className="text-[8px] md:text-[10px] font-mono opacity-50 text-right">
             DESIGNED BY<br/>HAZE NIGHTWALKER
           </div>
        </footer>
      </div>

      {/* EXPORT CONTAINER (UNCHANGED) */}
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
  );
};

export default App;
