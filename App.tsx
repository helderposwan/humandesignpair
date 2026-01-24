
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { BirthData, FullAnalysisResponse, Language } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { getFullCosmicAnalysis } from './services/geminiService.ts';
import { getTranslation } from './translations.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// --- CUSTOM CURSOR (DESKTOP ONLY) ---
const CustomCursor = React.memo(() => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // HEAVY OPTIMIZATION: Strictly disable on any touch device or small screen
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches);
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

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

  return <div ref={cursorRef} className="custom-cursor hidden lg:block"></div>;
});

// --- GALAXY BACKGROUND (HIGH PERFORMANCE MOBILE) ---
const GalaxyBackground = React.memo(() => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refSmall = useRef<HTMLDivElement>(null);
  const refMedium = useRef<HTMLDivElement>(null);
  const refLarge = useRef<HTMLDivElement>(null);

  // MEMOIZED STARS: Calculated once, never recalculated on resize to prevent lag
  const stars = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // EXTREME OPTIMIZATION: Only ~20 stars on mobile, no heavy effects
    const counts = isMobile ? { s: 15, m: 5, l: 2 } : { s: 150, m: 40, l: 10 };
    
    const generate = (count: number, sizeRange: [number, number], colorBase: string) => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        opacity: Math.random() * 0.7 + 0.3,
        animDuration: Math.random() * 4 + 3, // Slower animation is lighter
        animDelay: Math.random() * 5,
        color: colorBase
      }));
    };

    return {
      small: generate(counts.s, [1, 2], '#ffffff'), // Slightly larger on mobile to be visible without glow
      medium: generate(counts.m, [2, 3], '#e0e7ff'),
      large: generate(counts.l, [3, 4], '#c7d2fe')
    };
  }, []);

  useLayoutEffect(() => {
    // DISABLE PARALLAX ON MOBILE
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; 

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX - window.innerWidth / 2);
        const y = (e.clientY - window.innerHeight / 2);
        gsap.to(refSmall.current, { x: x * 0.02, y: y * 0.02, duration: 1 });
        gsap.to(refMedium.current, { x: x * 0.04, y: y * 0.04, duration: 1 });
        gsap.to(refLarge.current, { x: x * 0.08, y: y * 0.08, duration: 1 });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, refContainer);

    return () => ctx.revert();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    // FIX STRETCHING: Use h-[120vh] instead of inset-0 to prevent "kembang kempis" (rubber banding) on mobile address bar scroll
    <div ref={refContainer} className="fixed top-0 left-0 w-full h-[120vh] z-[0] bg-[#020205] pointer-events-none transform-gpu">
      
      {/* Static Gradient (Lighter than noise) */}
      <div className="absolute inset-0 opacity-40" 
           style={{ background: 'radial-gradient(circle at 50% 120%, #2e1065 0%, #000000 70%)' }}></div>
      
      {/* Stars Container */}
      <div ref={refSmall} className="absolute inset-0 will-change-transform">
        {stars.small.map(s => (
          <div key={`s-${s.id}`} className="absolute rounded-full star-animate"
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>

      <div ref={refMedium} className="absolute inset-0 will-change-transform">
        {stars.medium.map(s => (
          <div key={`m-${s.id}`} className={`absolute rounded-full star-animate ${isMobile ? '' : 'shadow-[0_0_3px_rgba(255,255,255,0.4)]'}`}
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>

      <div ref={refLarge} className="absolute inset-0 will-change-transform">
        {stars.large.map(s => (
          <div key={`l-${s.id}`} className={`absolute rounded-full star-animate ${isMobile ? '' : 'shadow-[0_0_8px_rgba(165,180,252,0.6)]'}`}
               style={{
                 left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
                 backgroundColor: s.color, opacity: s.opacity,
                 '--duration': `${s.animDuration}s`, '--delay': `${s.animDelay}s`
               } as React.CSSProperties} />
        ))}
      </div>
      
      {/* NOISE FILTER: ONLY ON DESKTOP. Expensive on mobile. */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      )}
    </div>
  );
});

// --- GALAXY LOADER (WITH BLACKHOLE IMPLOSION EFFECT) ---
const GalaxyLoader = React.memo(({ onComplete, lang }: { onComplete: () => void, lang: Language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const t = getTranslation(lang).loading;

  // 1. Progress Counter Simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear increment for organic feel
      const increment = Math.random() > 0.7 ? 5 : 1; 
      current += increment;
      
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(current);
    }, 40); // Total load approx 3-4s
    return () => clearInterval(interval);
  }, []);

  // 2. Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Phase A: Continuous Spin during loading
      const spinTween = gsap.to(galaxyRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      });

      // Phase B: Completion Sequence (The "Black Hole Implosion")
      if (progress === 100) {
        const tl = gsap.timeline({
          onComplete: () => {
             if (containerRef.current) containerRef.current.style.display = 'none';
             onComplete();
          }
        });

        spinTween.kill();

        tl.to(textRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" })
          .to(galaxyRef.current, { 
            rotation: "+=720",
            scale: 0.05, 
            opacity: 0,
            duration: 1.2, 
            ease: "expo.in"
          }, "-=0.1")
          .to(containerRef.current, { 
            backgroundColor: "#ffffff", 
            duration: 0.1,
            ease: "power1.out"
          }) 
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
          });
      }

    }, containerRef);
    return () => ctx.revert();
  }, [progress, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden">
       {/* Central Galaxy Graphic */}
       <div ref={galaxyRef} className="relative w-32 h-32 md:w-56 md:h-56 flex items-center justify-center will-change-transform">
          <div className="absolute w-6 h-6 bg-black rounded-full shadow-[0_0_25px_rgba(0,0,0,1)] z-10 border border-white/5"></div>
          <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-transparent blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute w-[120%] h-[120%] border-[2px] border-indigo-400/40 rounded-full skew-x-12 skew-y-6 shadow-[0_0_10px_rgba(129,140,248,0.3)]"></div>
          <div className="absolute w-[160%] h-[160%] border-[1px] border-purple-400/30 rounded-full -skew-x-12 -skew-y-6 opacity-80"></div>
          <div className="absolute w-[90%] h-[90%] border-t-[3px] border-white/30 rounded-full rotate-45 blur-[1px]"></div>
       </div>

       {/* Percentage Text with Monospace Font */}
       <div ref={textRef} className="mt-16 flex flex-col items-center space-y-3 z-20 mix-blend-screen">
          <span className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tabular-nums leading-none">
            {progress}%
          </span>
          <span className="text-[10px] font-mono tracking-[0.6em] text-indigo-300 uppercase animate-pulse">
            {t.calibrating}
          </span>
       </div>
    </div>
  );
});

// --- LAYOUT COMPONENTS ---
const Section = React.memo(({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <section className={`min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-16 md:py-20 ${className} relative z-10`}>
    {children}
  </section>
));

const RevealText = React.memo(({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const el = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if(el.current) {
       gsap.fromTo(el.current, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, delay, ease: "power3.out" }
        );
    }
  }, [delay]);
  return <div className={`overflow-hidden ${className}`}><div ref={el}>{text}</div></div>;
});

// --- DATA DISPLAY COMPONENTS ---
const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className="border-b border-white/10 py-5 flex justify-between items-baseline group transition-colors px-4 -mx-4">
    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</span>
    <span className="text-lg md:text-xl font-medium text-white text-right">{value}</span>
  </div>
);

// --- COMPACT DARK EXPORT COMPONENT ---
const CompactDarkProfile = ({ profile, color, label, t }: { profile: any, color: string, label: string, t: any }) => (
  <div className="bg-[#0a0a0a] p-8 rounded-[1.5rem] border border-white/10 flex flex-col h-full relative overflow-hidden">
    {/* Colored Accent Top */}
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${label.includes('ALPHA') ? 'from-indigo-500 to-indigo-800' : 'from-rose-500 to-rose-800'}`}></div>
    
    <div className="flex justify-between items-start mb-6">
       <div>
         <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${color} mb-2 block opacity-80`}>{label}</span>
         <h3 className="text-3xl font-heading font-black text-white leading-none tracking-tight">{profile.name}</h3>
       </div>
       <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5`}>
          <span className="text-lg">✦</span>
       </div>
    </div>

    <div className="space-y-4 flex-1">
       <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.type}</span>
          <span className="text-sm font-bold text-gray-200 text-right">{profile.hdType}</span>
       </div>
       <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.profile}</span>
          <span className="text-sm font-bold text-gray-200 text-right">{profile.hdProfile}</span>
       </div>
       <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.authority}</span>
          <span className="text-sm font-bold text-gray-200 text-right">{profile.hdAuthority}</span>
       </div>
       <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.sunSign}</span>
          <span className="text-sm font-bold text-gray-200 text-right">{profile.sunSign}</span>
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
  const [language, setLanguage] = useState<Language>('id');
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Auto-detect language
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      if (browserLang && !browserLang.startsWith('id')) {
        setLanguage('en');
      } else {
        setLanguage('id');
      }
    }
  }, []);

  const t = getTranslation(language);

  const handleIntroComplete = useCallback(() => {
    setIsLoadingApp(false);
  }, []);

  useEffect(() => {
    if (!isLoadingApp && appContainerRef.current) {
      gsap.to(appContainerRef.current, { opacity: 1, duration: 1 });
    }
  }, [isLoadingApp]);

  useLayoutEffect(() => {
    if (step === 'results' && resultsRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".res-title", { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
        gsap.from(".res-card", { y: 30, opacity: 0, duration: 1, stagger: 0.2, delay: 0.3, ease: "power2.out" });
      }, resultsRef);
      return () => ctx.revert();
    }
  }, [step]);

  const handleReveal = async () => {
    if (!personA.name || !personB.name || !personA.date || !personB.date || !personA.time || !personB.time) {
      alert(language === 'id' ? "Mohon lengkapi seluruh data." : "Please complete all fields.");
      return;
    }
    setStep('loading');
    setTimeout(async () => {
      try {
        const result = await getFullCosmicAnalysis(personA, personB, language);
        setAnalysis(result);
        setStep('results');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        setStep('input');
      }
    }, 1500);
  };

  const handleSaveImage = async () => {
    if (!exportRef.current || !analysis) return;
    setIsSaving(true);
    try {
      if (document.fonts) await document.fonts.ready;
      const element = exportRef.current;
      const fileName = `Cosmic_Report_${analysis.personA.name}_${analysis.personB.name}.jpg`;
      // @ts-ignore
      const canvas = await window.html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#030303', 
        logging: false, 
        width: 1000, 
        windowWidth: 1000,
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
    <div className="relative min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden flex flex-col bg-[#020205]">
      <CustomCursor />
      <GalaxyBackground />
      {isLoadingApp && <GalaxyLoader onComplete={handleIntroComplete} lang={language} />}
      
      {/* HEADER: Relative on Mobile, Fixed on Desktop */}
      <div className="relative md:fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-40 pointer-events-none mix-blend-difference shrink-0">
        <div className="flex flex-col">
          <span className="font-heading font-black text-xl md:text-2xl tracking-tighter">COSMIC VIBES</span>
          <span className="text-[8px] md:text-[10px] font-mono tracking-widest opacity-60">SYSTEM v2.0 | {language.toUpperCase()}</span>
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
                {t.intro.subtitle}
              </p>

              <div className="mt-12 md:mt-20 flex justify-center">
                <button 
                  onClick={() => setStep('input')}
                  className="group relative px-8 py-4 md:px-12 md:py-6 overflow-hidden rounded-full bg-white text-black font-bold tracking-widest text-[10px] md:text-sm transition-all hover:scale-105 hover:bg-indigo-50"
                >
                   <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                     {t.intro.startBtn} <span className="text-lg md:text-xl">→</span>
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
                  {t.input.title} <span className="text-indigo-500">.</span>
                </h2>
                <p className="mt-2 md:mt-4 text-gray-400 text-[10px] md:text-sm font-mono tracking-widest uppercase opacity-60">
                  {t.input.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative">
                <PersonInput 
                  index={1} 
                  label={t.input.labelAlpha} 
                  data={personA} 
                  onChange={setPersonA} 
                  accentColor="text-indigo-400" 
                  placeholderName={t.input.placeholderName}
                  placeholderDate={t.input.placeholderDate}
                  placeholderTime={t.input.placeholderTime}
                  placeholderCity={t.input.placeholderCity}
                />
                <PersonInput 
                  index={2} 
                  label={t.input.labelBeta} 
                  data={personB} 
                  onChange={setPersonB} 
                  accentColor="text-rose-400" 
                  placeholderName={t.input.placeholderName}
                  placeholderDate={t.input.placeholderDate}
                  placeholderTime={t.input.placeholderTime}
                  placeholderCity={t.input.placeholderCity}
                />
              </div>
              
              <div className="mt-12 md:mt-20 flex flex-col md:flex-row justify-end items-center">
                <button 
                  onClick={handleReveal}
                  className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 md:px-12 py-5 md:py-6 text-sm md:text-lg font-bold text-white transition-all duration-300 bg-white/5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-transparent focus:outline-none hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 backdrop-blur-md"
                >
                  <span className="mr-4 tracking-widest">{t.input.processBtn}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
            </div>
          </Section>
        )}

        {step === 'loading' && (
          <div className="h-screen flex flex-col items-center justify-center">
             <div className="text-4xl md:text-9xl font-heading font-black animate-pulse tracking-tighter">
                {t.loading.processing}
             </div>
             <div className="mt-4 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[1em] text-indigo-400 text-center px-4">
               {t.loading.decoding}
             </div>
          </div>
        )}

        {step === 'results' && analysis && (
          <div ref={resultsRef} className="pt-10 md:pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            {/* Results Content */}
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
                  {t.results.resonanceScore}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               <div className="res-card group relative p-8 md:p-12 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden transition-colors duration-500">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20">
                    <span className="text-4xl md:text-6xl font-heading">01</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-indigo-400 mb-8 tracking-tight">{analysis.personA.name}</h3>
                  <div className="space-y-2">
                     <DetailRow label={t.results.type.toUpperCase()} value={analysis.personA.hdType} />
                     <DetailRow label={t.results.profile.toUpperCase()} value={analysis.personA.hdProfile} />
                     <DetailRow label={t.results.authority.toUpperCase()} value={analysis.personA.hdAuthority} />
                     <DetailRow label={t.results.sunSign.toUpperCase()} value={analysis.personA.sunSign} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-gray-400 leading-relaxed font-mono">
                      {analysis.personA.hdIncarnationCross}
                    </p>
                  </div>
               </div>

               <div className="res-card group relative p-8 md:p-12 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden transition-colors duration-500">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20">
                    <span className="text-4xl md:text-6xl font-heading">02</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-rose-400 mb-8 tracking-tight">{analysis.personB.name}</h3>
                  <div className="space-y-2">
                     <DetailRow label={t.results.type.toUpperCase()} value={analysis.personB.hdType} />
                     <DetailRow label={t.results.profile.toUpperCase()} value={analysis.personB.hdProfile} />
                     <DetailRow label={t.results.authority.toUpperCase()} value={analysis.personB.hdAuthority} />
                     <DetailRow label={t.results.sunSign.toUpperCase()} value={analysis.personB.sunSign} />
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
               <h4 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-8">{t.results.verdict}</h4>
               <p className="text-xl md:text-4xl font-light leading-relaxed text-white">
                 "{analysis.compatibility.summary}"
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
               <div className="res-card p-8 md:p-10 rounded-[2rem] bg-[#080808] border-l-2 border-green-500/50">
                  <h4 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> {t.results.resonance}
                  </h4>
                  <ul className="space-y-4">
                    {analysis.compatibility.strengths.map((s, i) => (
                      <li key={i} className="text-gray-300 text-sm md:text-base border-b border-white/5 pb-3 last:border-0">{s}</li>
                    ))}
                  </ul>
               </div>
               <div className="res-card p-8 md:p-10 rounded-[2rem] bg-[#080808] border-l-2 border-amber-500/50">
                  <h4 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span> {t.results.friction}
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
                 {t.results.newAnalysis}
               </button>
               <button 
                  onClick={handleSaveImage} 
                  disabled={isSaving}
                  className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-indigo-50 transition-transform active:scale-95 disabled:opacity-50"
               >
                 {isSaving ? t.loading.generating : t.results.download}
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

      {/* NEW COMPACT EXPORT CONTAINER (DARK MODE) */}
      <div className="no-print" style={{ height: 0, overflow: 'hidden', position: 'relative', zIndex: -9999, visibility: 'hidden' }}>
        <div id="export-container" ref={exportRef} style={{ width: '1000px', backgroundColor: '#030303', padding: '0px', position: 'relative', display: 'block' }} className="font-sans text-white">
          <div className="w-full p-16 flex flex-col min-h-[1400px] relative">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-900/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <header className="flex justify-between items-start mb-16 relative z-10">
              <div className="flex flex-col">
                <h1 className="text-5xl font-heading font-black text-white tracking-tighter">COSMIC VIBES</h1>
                <p className="text-indigo-400 text-sm font-mono tracking-[0.4em] mt-2 uppercase">Quantum Synergy Report</p>
              </div>
              <div className="text-right">
                 <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{t.results.verified}</span>
                 </div>
              </div>
            </header>

            {/* Main Score Section */}
            <div className="flex flex-col items-center justify-center mb-16 relative z-10">
               <div className="relative">
                  <span 
                    className="text-[200px] leading-[0.8] font-heading font-black text-white tracking-tighter"
                    style={{ WebkitTextStroke: '8px #030303', paintOrder: 'stroke fill' }}
                  >
                    {analysis?.compatibility.score}
                  </span>
                  <span className="text-6xl font-black text-gray-500 absolute top-4 -right-12">%</span>
               </div>
               <h2 className="text-4xl font-heading font-light text-white mt-8 tracking-tight text-center max-w-2xl">
                 {analysis?.compatibility.headline}
               </h2>
               <div className="mt-6 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                  <span className="text-sm font-bold tracking-[0.2em] text-indigo-300 uppercase">{analysis?.compatibility.archetype}</span>
               </div>
            </div>

            {/* Compact Profiles Grid */}
            <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
              {analysis && <CompactDarkProfile profile={analysis.personA} color="text-indigo-400" label={t.input.labelAlpha} t={t.results} />}
              {analysis && <CompactDarkProfile profile={analysis.personB} color="text-rose-400" label={t.input.labelBeta} t={t.results} />}
            </div>

            {/* Summary Box */}
            <div className="bg-[#080808] border-l-4 border-indigo-500 p-10 rounded-r-[2rem] mb-12 relative z-10">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">{t.results.summary}</h4>
               <p className="text-2xl font-light italic text-gray-200 leading-relaxed">
                 "{analysis?.compatibility.summary}"
               </p>
            </div>

            {/* Key Strengths (3 max) */}
            <div className="grid grid-cols-1 gap-4 mb-auto relative z-10">
               {analysis?.compatibility.strengths.slice(0, 3).map((s, i) => (
                 <div key={i} className="flex items-center gap-6 p-4 border-b border-white/5">
                    <span className="text-xl text-green-400">✦</span>
                    <span className="text-lg font-medium text-gray-300">{s}</span>
                 </div>
               ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-gray-500 text-xs font-mono tracking-widest uppercase relative z-10">
               <span>{t.results.generatedOn} {new Date().toLocaleDateString()}</span>
               <span>cosmicvibes.app</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
