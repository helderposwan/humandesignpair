
import React from 'react';
import { TYPE_OPTIONS, AUTHORITY_OPTIONS, PROFILE_OPTIONS } from '../constants.ts';

interface PersonInputProps {
  label: string;
  data: any;
  onChange: (data: any) => void;
  accentColor: string;
}

const PersonInput: React.FC<PersonInputProps> = ({ label, data, onChange, accentColor }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 soft-shadow mb-6">
      <h3 className={`text-xl font-heading font-semibold mb-4 ${accentColor}`}>{label}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="Name"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Birth Date</label>
            <input 
              type="date" 
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">HD Type</label>
            <select 
              value={data.hdType || ''}
              onChange={(e) => handleChange('hdType', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700 appearance-none"
            >
              <option value="">Select Type</option>
              {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Authority</label>
            <select 
              value={data.hdAuthority || ''}
              onChange={(e) => handleChange('hdAuthority', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700 appearance-none"
            >
              <option value="">Select Authority</option>
              {AUTHORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Profile</label>
            <select 
              value={data.hdProfile || ''}
              onChange={(e) => handleChange('hdProfile', e.target.value)}
              className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-700 appearance-none"
            >
              <option value="">Select Profile</option>
              {PROFILE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInput;
