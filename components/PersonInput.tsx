
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

  const openDatePicker = () => {
    if (dateInputRef.current) {
      // showPicker() is supported in modern browsers to trigger the native UI
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const openTimePicker = () => {
    if (timeInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        timeInputRef.current.showPicker();
      } else {
        timeInputRef.current.focus();
      }
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 soft-shadow mb-6">
      <h3 className={`text-xl font-heading font-semibold mb-4 ${accentColor}`}>{label}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nama Lengkap</label>
          <input 
            type="text" 
            placeholder={placeholderName || "Contoh: Nama Lengkap"}
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Tanggal Lahir</label>
            <div className="relative">
              <input 
                ref={dateInputRef}
                type="date" 
                value={data.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full bg-white/80 border border-gray-100 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700 appearance-none"
              />
              <button 
                type="button"
                onClick={openDatePicker}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="Pilih Tanggal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Jam Lahir</label>
            <div className="relative">
              <input 
                ref={timeInputRef}
                type="time" 
                value={data.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full bg-white/80 border border-gray-100 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700 appearance-none"
              />
              <button 
                type="button"
                onClick={openTimePicker}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="Pilih Jam"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Tempat Lahir</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Contoh: Jakarta, Indonesia"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
