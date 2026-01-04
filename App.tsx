
import React, { useState, useEffect, useRef } from 'react';
import { BirthData, FullAnalysisResponse } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { calculateCompatibility, getZodiacSign, getShio } from './logic/compatibilityEngine.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'input' | 'loading' | 'results'>('welcome');
  const [personA, setPersonA] = useState<any>({ name: '', date: '', hdType: '', hdAuthority: '', hdProfile: '' });
  const [personB, setPersonB] = useState<any>({ name: '', date: '', hdType: '', hdAuthority: '', hdProfile: '' });
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === 'welcome' && headingRef.current) {
      gsap.to(headingRef.current, {
        duration: 2,
        text: "Unlock Your Connection",
        ease: "none",
        delay: 0.5
      });
    }
  }, [step]);

  const handleReveal = () => {
    const required = ['name', 'date', 'hdType', 'hdAuthority', 'hdProfile'];
    const isValA = required.every(k => personA[k]);
    const isValB = required.every(k => personB[k]);

    if (!isValA || !isValB) {
      alert("Please fill in all Human Design details for both people.");
      return;
    }

    setStep('loading');
    
    // Artificial delay for "Cosmic Drama" as per PRD
    setTimeout(() => {
      const shioA = getShio(personA.date);
      const shioB = getShio(personB.date);
      
      const comp = calculateCompatibility(personA, personB);

      const finalResult: FullAnalysisResponse = {
        personA: {
          ...personA,
          sunSign: getZodiacSign(personA.date),
          moonSign: "Check Chart", // Moon requires exact time, which we'll simplify to "Check Chart" locally
          shio: shioA.animal,
          element: shioA.element
        },
        personB: {
          ...personB,
          sunSign: getZodiacSign(personB.date),
          moonSign: "Check Chart",
          shio: shioB.animal,
          element: shioB.element
        },
        compatibility: {
          score: comp.score,
          headline: comp.headline,
          archetype: comp.archetype,
          summary: comp.summary,
          strengths: comp.strengths,
          challenges: comp.challenges
        }
      };

      setAnalysis(finalResult);
      setStep('results');
    }, 2000);
  };

  const reset = () => {
    setStep('input');
    setAnalysis(null);
  };

  const ProfileCard = ({ profile, color }: { profile: any, color: string }) => (
    <div className={`bg-white p-5 rounded-3xl border border-gray-100 soft-shadow mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      <h4 className={`text-lg font-heading font-bold ${color} mb-3`}>{profile.name}'s Profile</h4>
      <div className="grid grid-cols-2 gap-y-3 text-xs">
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter">Human Design</span>
          <span className="font-semibold text-gray-700">{profile.hdType}</span>
          <span className="block text-gray-500">{profile.hdProfile} ({profile.hdAuthority})</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter">Zodiac</span>
          <span className="font-semibold text-gray-700">☀️ {profile.sunSign}</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter">Chinese Sign</span>
          <span className="font-semibold text-gray-700">🏮 {profile.shio}</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase tracking-tighter">Element</span>
          <span className="font-semibold text-gray-700">🔥 {profile.element}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 py-8 flex flex-col">
      <header className="text-center mb-8 no-print">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
          CosmicVibe HD
        </h1>
        <p className="text-gray-500 text-sm mt-1">Universal Compatibility Decoder</p>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        {step === 'welcome' && (
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl">🌌</span>
            </div>
            <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4 h-8 min-h-[2rem]">
              <span ref={headingRef}></span>
              <span className="cursor">|</span>
            </h2>
            <p className="text-gray-600 mb-8 px-6 text-balance">
              100% Client-Side Compatibility Engine. No API Key required.
            </p>
            <button 
              onClick={() => setStep('input')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Start Decoding
            </button>
          </div>
        )}

        {step === 'input' && (
          <div className="animate-in fade-in duration-500">
            <PersonInput 
              label="First Person" 
              data={personA} 
              onChange={setPersonA}
              accentColor="text-indigo-600"
            />
            <PersonInput 
              label="Second Person" 
              data={personB} 
              onChange={setPersonB}
              accentColor="text-rose-500"
            />
            <button 
              onClick={handleReveal}
              className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all mt-4"
            >
              Reveal Connection
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center animate-in fade-in">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">✨</span>
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-700 animate-pulse">Aligning Cosmic Maps...</h3>
            <p className="text-gray-400 text-sm mt-2">Calculating local dynamics. No data is leaving your device.</p>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="animate-in zoom-in-95 fade-in duration-700 pb-10">
            <div className="bg-white p-8 rounded-[2.5rem] soft-shadow text-center mb-6 relative overflow-hidden">
              <div className="relative">
                <div className="text-6xl font-heading font-black text-indigo-600 mb-2">
                  {analysis.compatibility.score}%
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-800">{analysis.compatibility.headline}</h2>
                <span className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mt-3 uppercase tracking-widest">
                  {analysis.compatibility.archetype}
                </span>
              </div>
            </div>

            <ProfileCard profile={analysis.personA} color="text-indigo-600" />
            <ProfileCard profile={analysis.personB} color="text-rose-500" />

            <div className="bg-indigo-600 text-white p-6 rounded-3xl mb-6 shadow-xl shadow-indigo-100">
              <h4 className="text-xs font-bold uppercase tracking-tighter opacity-80 mb-3">Relationship Dynamics</h4>
              <p className="text-md leading-relaxed font-light italic">
                "{analysis.compatibility.summary}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/50 p-4 rounded-3xl border border-white/80">
                <h4 className="text-xs font-bold text-green-600 uppercase mb-2">Strengths</h4>
                <ul className="text-[10px] text-gray-600 space-y-2">
                  {analysis.compatibility.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-white/50 p-4 rounded-3xl border border-white/80">
                <h4 className="text-xs font-bold text-amber-600 uppercase mb-2">Challenges</h4>
                <ul className="text-[10px] text-gray-600 space-y-2">
                  {analysis.compatibility.challenges.map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 no-print">
              <button onClick={reset} className="flex-1 bg-gray-100 text-gray-600 font-semibold py-4 rounded-2xl active:scale-95 transition-all">New Chart</button>
              <button onClick={() => window.print()} className="flex-1 bg-indigo-600 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Save PDF</button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-gray-400 no-print pb-4">
        <p>© 2026 CosmicVibe. Built locally for your privacy.</p>
      </footer>
    </div>
  );
};

export default App;
