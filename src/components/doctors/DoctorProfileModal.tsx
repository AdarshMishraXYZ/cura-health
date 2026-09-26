import React, { useState } from 'react';
import { Doctor } from '../../types';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  GraduationCap, 
  Users, 
  Languages, 
  Award,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { DoctorAvatar } from '../common/DoctorAvatar';

interface DoctorProfileModalProps {
  doctor: Doctor;
  onClose: () => void;
  onBook: (doctor: Doctor, date: string, slot: string) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose, onBook }) => {
  const dates = doctor.availableDates;
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const selectedDateObj = dates[selectedDateIndex] || dates[0];
  
  const [selectedSlot, setSelectedSlot] = useState<string>(
    selectedDateObj?.slots[0] || '10:00'
  );

  const handleDateChange = (idx: number) => {
    setSelectedDateIndex(idx);
    const newDate = dates[idx];
    if (newDate && newDate.slots.length > 0) {
      setSelectedSlot(newDate.slots[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#11141E] border border-[#202636] rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar without numbered prefix */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
          <div>
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Physician Credentials</span>
            <h3 className="text-base font-bold text-white">Doctor Profile & Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181D2A] text-slate-400 hover:text-white hover:bg-[#202738] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Header Section */}
        <div className="flex items-start gap-4 py-4">
          <div className="relative shrink-0">
            <DoctorAvatar
              name={doctor.name}
              initials={doctor.initials}
              avatarUrl={doctor.avatarUrl}
              size="lg"
            />
            {doctor.status === 'available' && (
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-[#11141E] rounded-full"></span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-lg font-bold text-white">{doctor.name}</h2>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              {doctor.qualifications} · {doctor.specialtyName}
            </p>
            {doctor.education && (
              <p className="text-[11px] text-blue-300 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>{doctor.education}</span>
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
              <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {doctor.rating} ({doctor.reviewCount} reviews)
              </span>
              <span className="text-slate-400 font-medium">{doctor.experienceYears}y experience</span>
              {doctor.patientsTreated && (
                <span className="text-slate-400">{doctor.patientsTreated.toLocaleString()}+ patients</span>
              )}
            </div>
          </div>
        </div>

        {/* Clinic & Sub-specialties tags */}
        <div className="bg-[#151926] p-3 rounded-xl border border-[#22293C] space-y-2 mb-3">
          <div className="flex items-start gap-2 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">{doctor.hospital}</p>
              {doctor.address && <p className="text-[11px] text-slate-400">{doctor.address}</p>}
            </div>
          </div>

          {doctor.subSpecialties && doctor.subSpecialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#1E2638]">
              {doctor.subSpecialties.map((sub, i) => (
                <span key={i} className="text-[10px] bg-[#1E2538] text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="py-3 border-t border-[#1C2232]">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">About</h4>
          <p className="text-xs leading-relaxed text-slate-300">
            {doctor.about}
          </p>
        </div>

        {/* Consultation fee row */}
        <div className="py-3 border-t border-[#1C2232] flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Consultation fee</span>
          <span className="text-xl font-bold text-white">${doctor.consultationFee}</span>
        </div>

        {/* Booking Slots Section */}
        <div className="py-3 border-t border-[#1C2232]">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Booking slots
          </h4>

          {/* Date Selector Row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {dates.map((dateObj, idx) => {
              const isSelected = selectedDateIndex === idx;
              const [dayOfWeek, dayNum] = dateObj.dateStr.split(' ');
              return (
                <button
                  key={dateObj.dateStr}
                  onClick={() => handleDateChange(idx)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/40 ring-1 ring-blue-400'
                      : 'bg-[#151924] text-slate-400 border border-[#202738] hover:bg-[#1A202E] hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-medium opacity-90">{dayOfWeek}</span>
                  <span className="text-base font-bold mt-0.5">{dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-4 gap-2">
            {selectedDateObj?.slots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/40'
                      : 'bg-[#151924] text-slate-300 border border-[#202738] hover:bg-[#1A202E]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Book an appointment */}
        <div className="pt-4 border-t border-[#1C2232]">
          <button
            onClick={() => onBook(doctor, selectedDateObj.dateStr, selectedSlot)}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <span>Book an appointment</span>
            <span>·</span>
            <span>${doctor.consultationFee}</span>
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Instant booking confirmation · Free cancellation up to 2 hours before
          </p>
        </div>
      </div>
    </div>
  );
};
