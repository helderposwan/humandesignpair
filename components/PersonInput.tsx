
import React from 'react';
import { BirthData } from '../types';

interface PersonInputProps {
  label: string;
  data: BirthData;
  onChange: (data: BirthData) => void;
  accentColor: string;
}

const PersonInput: React.FC<PersonInputProps> = ({ label, data, onChange, accentColor }) => {
  const handleChange = (field: keyof BirthData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 soft-shadow mb-6">
      <h3 className={`text-xl font-heading font-semibold mb-4 ${accentColor}`}>{label}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="e.g. Alex"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 ml-1">Birth Date</label>
            <input 
              type="date" 
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 ml-1">Birth Time</label>
            <input 
              type="time" 
              value={data.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 ml-1">Birth Location (Optional)</label>
          <input 
            type="text" 
            placeholder="City, Country"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
