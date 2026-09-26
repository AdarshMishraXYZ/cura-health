import React from 'react';
import { Doctor } from '../../types';
import { Star, ShieldCheck, ChevronRight, GraduationCap, MapPin } from 'lucide-react';
import { DoctorAvatar } from '../common/DoctorAvatar';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  const isAvailable = doctor.status === 'available';

  return (
    <div
      onClick={() => onSelect(doctor)}
      className="group bg-[#141721] hover:bg-[#181D2A] border border-[#202534] hover:border-blue-500/40 rounded-2xl p-3.5 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Doctor Photo / Initials Avatar */}
        <div className="relative shrink-0">
          <DoctorAvatar
            name={doctor.name}
            initials={doctor.initials}
            avatarUrl={doctor.avatarUrl}
            size="md"
          />
          {isAvailable && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#141721] rounded-full"></span>
          )}
        </div>

        {/* Doctor Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-white font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">
              {doctor.name}
            </h4>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-400 truncate">{doctor.specialtyName}</p>

          {doctor.education && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-0.5">
              <GraduationCap className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">{doctor.education.split('School')[0]}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-0.5 text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {doctor.rating}
            </span>
            <span className="text-slate-600">·</span>
            <span>{doctor.experienceYears}y exp</span>
            {doctor.patientsTreated && (
              <>
                <span className="text-slate-600">·</span>
                <span>{doctor.patientsTreated.toLocaleString()}+ patients</span>
              </>
            )}
            <span className="text-slate-600">·</span>
            <span className="text-slate-200 font-semibold">${doctor.consultationFee}</span>
          </div>
        </div>
      </div>

      {/* Status Badge & Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isAvailable
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
              : 'text-slate-400 bg-slate-800/60 border border-slate-700/40'
          }`}
        >
          {doctor.statusLabel || (isAvailable ? 'Available' : 'Busy')}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
