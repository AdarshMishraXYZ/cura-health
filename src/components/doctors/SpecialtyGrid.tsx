import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/specialties';
import { SpecialtyIcon } from '../common/SpecialtyIcon';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const SpecialtyGrid: React.FC = () => {
  const { navigateToSpecialty, setActiveTab } = useApp();

  return (
    <div className="p-4 space-y-4">
      {/* Title matching Screenshot 6 */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Find by speciality</h2>
        <p className="text-xs text-slate-400 mt-0.5">Browse doctors by category</p>
      </div>

      {/* Grid of Speciality Cards matching Screenshot 6 */}
      <div className="grid grid-cols-2 gap-3">
        {SPECIALTIES.map((spec) => (
          <div
            key={spec.id}
            onClick={() => navigateToSpecialty(spec.id)}
            className="group bg-[#141721] hover:bg-[#181E2C] border border-[#202534] hover:border-blue-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg"
          >
            {/* Circular Specialty Icon matching Screenshot 6 */}
            <div className="w-12 h-12 rounded-full bg-[#182846] text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors border border-blue-500/20">
              <SpecialtyIcon id={spec.id} className="w-6 h-6" />
            </div>

            {/* Specialty Name */}
            <h3 className="text-xs font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
              {spec.name}
            </h3>

            {/* Doctor Count subtitle */}
            <span className="text-[11px] text-slate-500 mt-1">
              {spec.doctorCount} doctors
            </span>
          </div>
        ))}
      </div>

      {/* AI Assistant Quick Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-[#121622] border border-[#1E2536] flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Can't decide on a specialty?</p>
          <p className="text-[11px] text-slate-400">Describe your symptoms to our clinical triage AI</p>
        </div>
        <button
          onClick={() => setActiveTab('symptom-ai')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Ask AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
