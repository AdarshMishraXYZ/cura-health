import React, { useState } from 'react';
import { Doctor } from '../../types';
import { DOCTORS } from '../../data/doctors';
import { DoctorAvatar } from '../common/DoctorAvatar';
import { Star, Check, Award, ArrowRight } from 'lucide-react';

interface DoctorComparisonProps {
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorComparison: React.FC<DoctorComparisonProps> = ({ onBookDoctor }) => {
  const [doc1Id, setDoc1Id] = useState<string>(DOCTORS[0]?.id || 'doc-1');
  const [doc2Id, setDoc2Id] = useState<string>(DOCTORS[1]?.id || 'doc-2');

  const doctor1 = DOCTORS.find(d => d.id === doc1Id) || DOCTORS[0];
  const doctor2 = DOCTORS.find(d => d.id === doc2Id) || DOCTORS[1];

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
          <Award className="w-3.5 h-3.5" />
          Decision Assistant
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Doctor Side-by-Side Comparison</h2>
        <p className="text-xs text-slate-400">Compare fees, patient ratings, credentials and availability</p>
      </div>

      {/* Doctor Pickers */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Doctor 1</label>
          <select
            value={doc1Id}
            onChange={(e) => setDoc1Id(e.target.value)}
            className="w-full bg-[#141721] border border-[#202534] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {DOCTORS.map(d => (
              <option key={d.id} value={d.id} disabled={d.id === doc2Id}>
                {d.name} ({d.specialtyName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Doctor 2</label>
          <select
            value={doc2Id}
            onChange={(e) => setDoc2Id(e.target.value)}
            className="w-full bg-[#141721] border border-[#202534] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {DOCTORS.map(d => (
              <option key={d.id} value={d.id} disabled={d.id === doc1Id}>
                {d.name} ({d.specialtyName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-[#141721] border border-[#202534] rounded-2xl overflow-hidden shadow-xl">
        {/* Doctor Header Cards */}
        <div className="grid grid-cols-2 divide-x divide-[#202534] border-b border-[#202534]">
          {/* Doctor 1 Profile */}
          <div className="p-3.5 flex flex-col items-center text-center">
            <DoctorAvatar
              name={doctor1.name}
              initials={doctor1.initials}
              avatarUrl={doctor1.avatarUrl}
              className="w-14 h-14 mb-2 ring-2 ring-blue-500/30"
            />
            <h4 className="text-xs font-bold text-white leading-tight">{doctor1.name}</h4>
            <p className="text-[10px] text-blue-400 font-medium mb-1">{doctor1.specialtyName}</p>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              {doctor1.rating} <span className="text-slate-400 font-normal">({doctor1.reviewCount})</span>
            </div>
            <button
              onClick={() => onBookDoctor(doctor1)}
              className="mt-3 w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              Book Dr. {doctor1.name.split(' ')[1]}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Doctor 2 Profile */}
          <div className="p-3.5 flex flex-col items-center text-center">
            <DoctorAvatar
              name={doctor2.name}
              initials={doctor2.initials}
              avatarUrl={doctor2.avatarUrl}
              className="w-14 h-14 mb-2 ring-2 ring-indigo-500/30"
            />
            <h4 className="text-xs font-bold text-white leading-tight">{doctor2.name}</h4>
            <p className="text-[10px] text-indigo-400 font-medium mb-1">{doctor2.specialtyName}</p>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              {doctor2.rating} <span className="text-slate-400 font-normal">({doctor2.reviewCount})</span>
            </div>
            <button
              onClick={() => onBookDoctor(doctor2)}
              className="mt-3 w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              Book Dr. {doctor2.name.split(' ')[1]}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Feature Comparison Rows */}
        <div className="divide-y divide-[#1D2230] text-xs">
          {/* Row 1: Consultation Fee */}
          <div className="p-2.5 bg-[#10131B]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Consultation Fee
            </span>
            <div className="grid grid-cols-2 text-center font-bold">
              <span className={doctor1.consultationFee <= doctor2.consultationFee ? 'text-emerald-400' : 'text-slate-300'}>
                ${doctor1.consultationFee} {doctor1.consultationFee <= doctor2.consultationFee && '★ Best Value'}
              </span>
              <span className={doctor2.consultationFee <= doctor1.consultationFee ? 'text-emerald-400' : 'text-slate-300'}>
                ${doctor2.consultationFee} {doctor2.consultationFee <= doctor1.consultationFee && '★ Best Value'}
              </span>
            </div>
          </div>

          {/* Row 2: Experience */}
          <div className="p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Clinical Experience
            </span>
            <div className="grid grid-cols-2 text-center text-slate-200">
              <span>{doctor1.experienceYears} Years</span>
              <span>{doctor2.experienceYears} Years</span>
            </div>
          </div>

          {/* Row 3: Hospital & Location */}
          <div className="p-2.5 bg-[#10131B]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Hospital Affiliation
            </span>
            <div className="grid grid-cols-2 text-center text-[11px] text-slate-300 px-1 gap-2">
              <span className="line-clamp-2">{doctor1.hospital}</span>
              <span className="line-clamp-2">{doctor2.hospital}</span>
            </div>
          </div>

          {/* Row 4: Education */}
          <div className="p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Education & Qualifications
            </span>
            <div className="grid grid-cols-2 text-center text-[11px] text-slate-300 px-1 gap-2">
              <span>{doctor1.education || doctor1.qualifications}</span>
              <span>{doctor2.education || doctor2.qualifications}</span>
            </div>
          </div>

          {/* Row 5: Patients Treated */}
          <div className="p-2.5 bg-[#10131B]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Patients Treated
            </span>
            <div className="grid grid-cols-2 text-center text-slate-200 font-semibold">
              <span>{doctor1.patientsTreated ? `${doctor1.patientsTreated}+` : '1,500+'}</span>
              <span>{doctor2.patientsTreated ? `${doctor2.patientsTreated}+` : '1,200+'}</span>
            </div>
          </div>

          {/* Row 6: Languages */}
          <div className="p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Languages Spoken
            </span>
            <div className="grid grid-cols-2 text-center text-[11px] text-slate-300">
              <span>{doctor1.languages?.join(', ') || 'English'}</span>
              <span>{doctor2.languages?.join(', ') || 'English'}</span>
            </div>
          </div>

          {/* Row 7: Available Next Slot */}
          <div className="p-2.5 bg-[#10131B]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-1">
              Earliest Slot Available
            </span>
            <div className="grid grid-cols-2 text-center text-[11px] font-medium text-emerald-400">
              <span className="flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                {doctor1.availableDates[0]?.dateStr} @ {doctor1.availableDates[0]?.slots[0]}
              </span>
              <span className="flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                {doctor2.availableDates[0]?.dateStr} @ {doctor2.availableDates[0]?.slots[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
