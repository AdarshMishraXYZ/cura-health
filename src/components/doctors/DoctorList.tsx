import React, { useMemo } from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DOCTORS } from '../../data/doctors';
import { SPECIALTIES } from '../../data/specialties';
import { DoctorCard } from './DoctorCard';
import { SpecialtyId } from '../../types';

export const DoctorList: React.FC = () => {
  const { 
    selectedSpecialtyId, 
    setSelectedSpecialtyId, 
    searchQuery, 
    setSearchQuery, 
    setSelectedDoctor,
    setActiveTab
  } = useApp();

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Specialty filter
      const matchesSpecialty = !selectedSpecialtyId || doc.specialtyId === selectedSpecialtyId;
      
      // Search filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesSpecialty;

      const matchesSearch = 
        doc.name.toLowerCase().includes(query) ||
        doc.specialtyName.toLowerCase().includes(query) ||
        doc.about.toLowerCase().includes(query) ||
        doc.hospital.toLowerCase().includes(query);

      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialtyId, searchQuery]);

  return (
    <div className="p-4 space-y-4">
      {/* Title matching screenshot Page 1 */}
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Clinical Discovery</span>
        <h2 className="text-lg font-bold text-white tracking-tight">Specialty Browsing & Doctors</h2>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctor or specialty"
          className="w-full bg-[#141721] text-sm text-slate-200 placeholder-slate-500 pl-10 pr-9 py-2.5 rounded-xl border border-[#202534] focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Specialty Pills matching Screenshot 1 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedSpecialtyId(null)}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
            selectedSpecialtyId === null
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/40'
              : 'bg-[#141721] text-slate-300 border border-[#202534] hover:bg-[#1A1F2C]'
          }`}
        >
          All Specialties
        </button>
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialtyId === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialtyId(spec.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/40'
                  : 'bg-[#141721] text-slate-300 border border-[#202534] hover:bg-[#1A1F2C]'
              }`}
            >
              {spec.name}
            </button>
          );
        })}
      </div>

      {/* Doctors Available Count row */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs font-medium text-slate-400">
          <span className="text-slate-200 font-semibold">{filteredDoctors.length} doctors</span> available
        </p>
        <button
          onClick={() => setActiveTab('specialties')}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
        >
          <span>View category grid</span>
          <span>→</span>
        </button>
      </div>

      {/* Doctor Cards List */}
      <div className="space-y-2.5">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onSelect={(d) => setSelectedDoctor(d)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-[#141721] border border-[#202534] rounded-2xl">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No doctors found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the specialty filter or modifying search keywords.</p>
            <button
              onClick={() => {
                setSelectedSpecialtyId(null);
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant Quick Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Not sure which doctor to pick?</p>
            <p className="text-[11px] text-slate-400">Use our AI Symptom Analyzer or Guided Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('symptom-ai')}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-500 transition-colors shadow-sm"
        >
          Try AI
        </button>
      </div>
    </div>
  );
};
