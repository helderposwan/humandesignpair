
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
    <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl mb-8 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-indigo-500/10">
      <h3 className={`text-xl font-heading font-bold mb-8 flex items-center gap-3 ${accentColor} tracking-wide`}>
        <span className="w-2 h-2 rounded-full bg-current shadow-[0_0_10px_currentColor]"></span>
        {label}
      </h3>
      
      <div className="space-y-8">
        {/* Name Input */}
        <div className="group relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-white">
            Nama Lengkap
          </label>
          <input 
            type="text" 
            placeholder={placeholderName || "Contoh: Nama Anda"}
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-white focus:outline-none transition-all text-white placeholder:text-gray-600 font-heading font-medium text-lg"
          />
        </div>

        {/* Date Input */}
        <div 
          className="group relative cursor-pointer"
          onClick={(e) => handleTriggerPicker(e, dateInputRef)}
        >
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-white">
            Tanggal Lahir
          </label>
          <div className="relative">
            <input 
              ref={dateInputRef}
              type="date" 
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-white focus:outline-none transition-all text-white font-heading font-medium text-lg appearance-none cursor-pointer block min-h-[50px] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        {/* Time Input */}
        <div 
          className="group relative cursor-pointer"
          onClick={(e) => handleTriggerPicker(e, timeInputRef)}
        >
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-white">
            Jam Lahir
          </label>
          <div className="relative">
            <input 
              ref={timeInputRef}
              type="time" 
              value={data.time || ''}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-white focus:outline-none transition-all text-white font-heading font-medium text-lg appearance-none cursor-pointer block min-h-[50px] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="group relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-white">
            Tempat Lahir
          </label>
          <input 
            type="text" 
            placeholder="Contoh: Jakarta, Indonesia"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-white focus:outline-none transition-all text-white placeholder:text-gray-600 font-heading font-medium text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
