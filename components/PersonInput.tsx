
import React, { useRef } from 'react';

interface PersonInputProps {
  label: string;
  data: any;
  onChange: (data: any) => void;
  accentColor: string;
  placeholderName?: string;
}

const PersonInput: React.FC<PersonInputProps> = ({ label, data, onChange, accentColor, placeholderName }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleTriggerPicker = (e: React.MouseEvent | React.TouchEvent, ref: React.RefObject<HTMLInputElement>) => {
    // Berhenti jika event berasal dari input itu sendiri untuk mencegah loop/konflik pada beberapa browser mobile
    if (e.target === ref.current) return;

    if (ref.current) {
      ref.current.focus();
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          ref.current.showPicker();
        } catch (err) {
          console.debug("showPicker failed, falling back to focus", err);
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className={`text-lg font-heading font-bold mb-8 flex items-center gap-2 ${accentColor}`}>
        <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
        {label}
      </h3>
      
      <div className="space-y-8">
        {/* Name Input */}
        <div className="group relative">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-500">
            Nama Lengkap
          </label>
          <input 
            type="text" 
            placeholder={placeholderName || "Contoh: Nama Anda"}
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-indigo-500 focus:outline-none transition-all text-gray-800 placeholder:text-gray-200 font-medium text-lg"
          />
        </div>

        {/* Date Input */}
        <div 
          className="group relative cursor-pointer active:opacity-70 transition-opacity"
          onClick={(e) => handleTriggerPicker(e, dateInputRef)}
        >
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-500">
            Tanggal Lahir
          </label>
          <div className="relative">
            <input 
              ref={dateInputRef}
              type="date" 
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-indigo-500 focus:outline-none transition-all text-gray-800 font-medium text-lg appearance-none cursor-pointer block min-h-[50px]"
            />
            <div className="absolute right-0 bottom-4 text-gray-300 pointer-events-none group-focus-within:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
        </div>

        {/* Time Input */}
        <div 
          className="group relative cursor-pointer active:opacity-70 transition-opacity"
          onClick={(e) => handleTriggerPicker(e, timeInputRef)}
        >
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-500">
            Jam Lahir
          </label>
          <div className="relative">
            <input 
              ref={timeInputRef}
              type="time" 
              value={data.time || ''}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-indigo-500 focus:outline-none transition-all text-gray-800 font-medium text-lg appearance-none cursor-pointer block min-h-[50px]"
            />
            <div className="absolute right-0 bottom-4 text-gray-300 pointer-events-none group-focus-within:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="group relative">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-500">
            Tempat Lahir
          </label>
          <input 
            type="text" 
            placeholder="Contoh: Jakarta, Indonesia"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-indigo-500 focus:outline-none transition-all text-gray-800 placeholder:text-gray-200 font-medium text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
