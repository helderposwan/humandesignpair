
import React, { useRef } from 'react';

interface PersonInputProps {
  label: string;
  data: any;
  onChange: (data: any) => void;
  accentColor: string;
  placeholderName?: string;
  placeholderDate?: string;
  placeholderTime?: string;
  placeholderCity?: string;
  index: number;
}

const PersonInput: React.FC<PersonInputProps> = ({ 
  label, data, onChange, accentColor, 
  placeholderName, placeholderDate, placeholderTime, placeholderCity,
  index 
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleTriggerPicker = (e: React.MouseEvent | React.TouchEvent, ref: React.RefObject<HTMLInputElement>) => {
    if (e.target === ref.current) return;
    if (ref.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try { ref.current.showPicker(); } catch (err) { console.debug("showPicker failed", err); }
      } else {
        ref.current.focus();
      }
    }
  };

  return (
    <div className="w-full h-full">
      {/* Bento Glass Card Container */}
      <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-500 hover:bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10 group will-change-transform ring-1 ring-white/5">
        
        {/* Decorative Index Watermark - Inside the card now */}
        <div className="absolute -right-6 -top-6 text-[120px] md:text-[180px] font-heading font-black text-white/[0.03] leading-none select-none pointer-events-none z-0 transition-transform duration-700 group-hover:scale-110 group-hover:text-white/[0.05]">
          0{index}
        </div>

        <div className="relative z-10">
          {/* Header with Glowing Dot Indicator */}
          <div className="flex items-center gap-4 mb-10 md:mb-12">
             <div className={`w-3 h-3 rounded-full ${index === 1 ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]' : 'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)]'}`}></div>
             <h3 className={`text-xs md:text-sm font-bold uppercase tracking-[0.3em] ${accentColor} opacity-90`}>
                {label}
             </h3>
          </div>
          
          <div className="space-y-8 md:space-y-10">
            {/* Name Input */}
            <div className="group relative">
              <input 
                type="text" 
                value={data.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-xl md:text-3xl font-heading font-light text-white focus:border-white/60 focus:outline-none transition-all placeholder-shown:border-white/10"
              />
              <label className="absolute left-0 top-3 md:top-4 text-base md:text-xl text-gray-500 font-light transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-gray-400 peer-focus:tracking-widest peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-widest pointer-events-none">
                {placeholderName || "NAMA LENGKAP"}
              </label>
              <div className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r ${index === 1 ? 'from-indigo-500 to-purple-500' : 'from-rose-500 to-orange-500'} w-0 transition-all duration-500 peer-focus:w-full opacity-80`}></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {/* Date Input */}
              <div 
                className="group relative cursor-pointer hover-trigger"
                onClick={(e) => handleTriggerPicker(e, dateInputRef)}
              >
                <div className="relative">
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    value={data.date || ''}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="peer w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-heading font-light text-white focus:border-white/60 focus:outline-none transition-all min-h-[50px] md:min-h-[60px]"
                  />
                   <label className="absolute left-0 -top-5 text-[10px] tracking-widest text-gray-500 font-light pointer-events-none uppercase">
                    {placeholderDate || "TGL LAHIR"}
                  </label>
                  <div className={`absolute bottom-0 left-0 h-[1px] bg-white w-0 transition-all duration-500 peer-focus:w-full opacity-50`}></div>
                </div>
              </div>

              {/* Time Input */}
              <div 
                className="group relative cursor-pointer hover-trigger"
                onClick={(e) => handleTriggerPicker(e, timeInputRef)}
              >
                <div className="relative">
                  <input 
                    ref={timeInputRef}
                    type="time" 
                    value={data.time || ''}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="peer w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-heading font-light text-white focus:border-white/60 focus:outline-none transition-all min-h-[50px] md:min-h-[60px]"
                  />
                   <label className="absolute left-0 -top-5 text-[10px] tracking-widest text-gray-500 font-light pointer-events-none uppercase">
                    {placeholderTime || "JAM"}
                  </label>
                  <div className={`absolute bottom-0 left-0 h-[1px] bg-white w-0 transition-all duration-500 peer-focus:w-full opacity-50`}></div>
                </div>
              </div>
            </div>

            {/* Location Input */}
            <div className="group relative">
              <input 
                type="text" 
                value={data.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-2xl font-heading font-light text-white focus:border-white/60 focus:outline-none transition-all"
              />
              <label className="absolute left-0 top-3 md:top-4 text-base md:text-lg text-gray-500 font-light transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-gray-400 peer-focus:tracking-widest peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-widest pointer-events-none uppercase">
                {placeholderCity || "KOTA KELAHIRAN"}
              </label>
               <div className={`absolute bottom-0 left-0 h-[1px] bg-white w-0 transition-all duration-500 peer-focus:w-full opacity-50`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
