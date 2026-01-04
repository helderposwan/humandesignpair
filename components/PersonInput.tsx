
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

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const triggerTimePicker = () => {
    if (timeInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        timeInputRef.current.showPicker();
      } else {
        timeInputRef.current.focus();
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 transition-all">
      <h3 className={`text-lg font-heading font-medium mb-6 ${accentColor}`}>
        {label}
      </h3>
      
      <div className="space-y-8">
        {/* Name Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Nama Lengkap
          </label>
          <input 
            type="text" 
            placeholder={placeholderName || "Jawaban Anda"}
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-white border-b border-gray-300 py-1 focus:border-indigo-600 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-300 text-base"
          />
        </div>

        {/* Date Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Tanggal Lahir
          </label>
          <div className="relative cursor-pointer" onClick={triggerDatePicker}>
            <input 
              ref={dateInputRef}
              type="date" 
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-white border-b border-gray-300 py-1 focus:border-indigo-600 focus:outline-none transition-colors text-gray-900 appearance-none cursor-pointer text-base"
            />
            <div className="absolute right-0 bottom-2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
        </div>

        {/* Time Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Jam Lahir
          </label>
          <div className="relative cursor-pointer" onClick={triggerTimePicker}>
            <input 
              ref={timeInputRef}
              type="time" 
              value={data.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-white border-b border-gray-300 py-1 focus:border-indigo-600 focus:outline-none transition-colors text-gray-900 appearance-none cursor-pointer text-base"
            />
            <div className="absolute right-0 bottom-2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Tempat Lahir
          </label>
          <input 
            type="text" 
            placeholder="Contoh: Jakarta, Indonesia"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-white border-b border-gray-300 py-1 focus:border-indigo-600 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-300 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
