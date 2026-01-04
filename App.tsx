
import React, { useState, useEffect, useRef } from 'react';
import { BirthData, FullAnalysisResponse } from './types.ts';
import PersonInput from './components/PersonInput.tsx';
import { getFullCosmicAnalysis } from './services/geminiService.ts';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP Plugin
gsap.registerPlugin(TextPlugin);

// Type definition for aistudio window global
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'input' | 'loading' | 'results'>('welcome');
  const [personA, setPersonA] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [personB, setPersonB] = useState<BirthData>({ name: '', date: '', time: '', location: '' });
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [needsKeySetup, setNeedsKeySetup] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Check for API key on load
  const checkKey = async () => {
    // Check all possible locations for the key
    const envKey = process.env.API_KEY || (process.env as any).API_Key || (process.env as any).api_key;
    const hasEnvKey = !!envKey && envKey !== 'undefined' && envKey !== '';
    
    if (hasEnvKey) {
      setNeedsKeySetup(false);
      setDebugInfo('Key detected in Environment');
    } else if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setNeedsKeySetup(!selected);
      setDebugInfo(selected ? 'Key detected via AI Studio' : 'No key found. Please setup.');
    } else {
      setNeedsKeySetup(true);
      setDebugInfo('No environment key and no AI Studio found.');
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  // Typewriter animation effect
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

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per race condition rules
      setNeedsKeySetup(false);
    } else {
      alert("No key found in Cloudflare. \n\nTips:\n1. Pastikan nama variabel 'API_KEY' (Huruf Besar).\n2. Pastikan sudah klik 'Retry Deployment' di Cloudflare.");
    }
  };

  const handleReveal = async () => {
    if (!personA.name || !personB.name || !personA.date || !personB.date) {
      alert("Please enter at least Name and Date of Birth for both people.");
      return;
    }

    setStep('loading');
    try {
      const result = await getFullCosmicAnalysis(personA, personB);
      setAnalysis(result);
      setStep('results');
    } catch (error: any) {
      console.error("Analysis Error:", error);
      
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY")) {
        alert("API Key bermasalah atau tidak ditemukan. \n\nMohon pastikan Anda sudah melakukan 'Retry Deployment' di dashboard Cloudflare setelah menambah variabel.");
        setStep('welcome');
        setNeedsKeySetup(true);
        return;
      }

      const msg = error.message || "An unexpected error occurred.";
      alert(`Error: ${msg}`);
      setStep('input');
    }
  };

  const handleSavePDF = () => {
    window.print();
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
          <span className="block text-gray-500">🌙 {profile.moonSign}</span>
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
            <p className="text-gray-600 mb-8 px-6 text-balance animate-in fade-in duration-1000 delay-500">
              Find out how your birth details create a unique dynamic in Human Design, Astrology, and Shio.
            </p>
            
            {needsKeySetup ? (
              <div className="space-y-4">
                <p className="text-[10px] text-rose-500 font-medium bg-rose-50 py-2 rounded-lg px-2">
                  Status: {debugInfo}
                </p>
                <button 
                  onClick={handleOpenKeySelector}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  Set up API Key Manual
                </button>
                <button 
                  onClick={() => checkKey()}
                  className="w-full bg-white border border-gray-200 text-gray-500 text-xs font-medium py-2 rounded-xl transition-all active:scale-95"
                >
                  Refresh Key Status
                </button>
                <div className="text-[10px] text-gray-400 mt-4 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="font-bold mb-1">Jika sudah set API_KEY di Cloudflare:</p>
                  <p>1. Pastikan sudah klik <strong>Save</strong> di Cloudflare Settings.</p>
                  <p>2. Wajib klik <strong>Retry Deployment</strong> di tab Deployments agar Cloudflare memasukkan kuncinya ke web.</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setStep('input')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Start Decoding
              </button>
            )}
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
            <h3 className="text-xl font-heading font-semibold text-gray-700 animate-pulse">Syncing cosmic maps...</h3>
            <p className="text-gray-400 text-sm mt-2">Checking Stars, Planets, and Human Design Gates.</p>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="animate-in zoom-in-95 fade-in duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] soft-shadow text-center mb-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full opacity-50 no-print"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-50 rounded-full opacity-50 no-print"></div>
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
              <p className="text-md leading-relaxed font-light">
                {analysis.compatibility.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/50 p-4 rounded-3xl border border-white/80">
                <h4 className="text-xs font-bold text-green-600 uppercase mb-2">Sync Points</h4>
                <ul className="text-[10px] text-gray-600 space-y-2">
                  {analysis.compatibility.strengths.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-white/50 p-4 rounded-3xl border border-white/80">
                <h4 className="text-xs font-bold text-amber-600 uppercase mb-2">Growth areas</h4>
                <ul className="text-[10px] text-gray-600 space-y-2">
                  {analysis.compatibility.challenges.slice(0, 3).map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 no-print">
              <button onClick={reset} className="flex-1 bg-gray-100 text-gray-600 font-semibold py-4 rounded-2xl active:scale-95 transition-all">New Chart</button>
              <button onClick={handleSavePDF} className="flex-1 bg-indigo-600 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Save PDF</button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-gray-400 no-print pb-4">
        <p>© 2026 CosmicVibe. For entertainment purposes.</p>
        <p className="mt-1 font-medium text-gray-500 uppercase tracking-tighter">Built by Haze Nightwalker</p>
      </footer>
    </div>
  );
};

export default App;
