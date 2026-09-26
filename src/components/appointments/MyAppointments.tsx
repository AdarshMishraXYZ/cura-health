import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Pill
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoctorAvatar } from '../common/DoctorAvatar';
import { MedicationTracker } from '../health/MedicationTracker';

export const MyAppointments: React.FC = () => {
  const { appointments, cancelAppointment, setActiveVideoCall, savedReports, setActiveTab } = useApp();
  const [selectedSubTab, setSelectedSubTab] = useState<'upcoming' | 'tracker' | 'vault'>('upcoming');

  const activeAppointments = appointments.filter(a => a.status === 'confirmed');

  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Patient Portal</span>
        <h2 className="text-lg font-bold text-white tracking-tight">Care Management & Vault</h2>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-2xl border border-[#1E2536]">
        <button
          onClick={() => setSelectedSubTab('upcoming')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedSubTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bookings ({activeAppointments.length})
        </button>
        <button
          onClick={() => setSelectedSubTab('tracker')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedSubTab === 'tracker'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          Pill Tracker
        </button>
        <button
          onClick={() => setSelectedSubTab('vault')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedSubTab === 'vault'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Vault ({savedReports.length})
        </button>
      </div>

      {selectedSubTab === 'tracker' && (
        <MedicationTracker />
      )}

      {selectedSubTab === 'upcoming' && (
        <div className="space-y-3">
          {activeAppointments.length > 0 ? (
            activeAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-[#121622] border border-[#1E2536] rounded-2xl p-4 shadow-lg space-y-3 relative overflow-hidden"
              >
                {/* Status indicator bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-emerald-400">Confirmed Booking</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">#{apt.id}</span>
                </div>

                {/* Doctor details */}
                <div className="flex items-center gap-3">
                  <DoctorAvatar
                    name={apt.doctorName}
                    initials={apt.doctorInitials}
                    avatarUrl={apt.doctorAvatar}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">{apt.doctorName}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{apt.doctorSpecialty}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">Patient: {apt.patientName}</p>
                  </div>
                </div>

                {/* Date & Time pill */}
                <div className="bg-[#161B28] rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold">{apt.dateStr}</span>
                    <span className="text-slate-600">·</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold">{apt.slotTime}</span>
                  </div>

                  <span className="text-blue-400 capitalize font-medium text-[11px] bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    {apt.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#1C2232]">
                  {apt.type === 'video' && (
                    <button
                      onClick={() => setActiveVideoCall(apt)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Telehealth Call</span>
                    </button>
                  )}

                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="py-2 px-3 bg-[#181D2A] hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 border border-[#232B3D] hover:border-rose-500/30 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-[#121622] border border-[#1E2536] rounded-2xl">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No active bookings</p>
              <p className="text-xs text-slate-500 mt-1">Book an appointment with a top specialist in seconds.</p>
              <button
                onClick={() => setActiveTab('doctors')}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
              >
                Browse Doctors
              </button>
            </div>
          )}
        </div>
      )}

      {selectedSubTab === 'vault' && (
        <div className="space-y-3">
          {savedReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setActiveTab('report-ai')}
              className="bg-[#121622] hover:bg-[#161B28] border border-[#1E2536] hover:border-blue-500/40 rounded-2xl p-3.5 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-[#182030] text-blue-400 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{report.fileName}</h4>
                  <p className="text-[11px] text-slate-400">{report.category} · {report.fileSize}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">{report.biomarkers.length} biomarkers analyzed</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-blue-400 font-medium shrink-0">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
