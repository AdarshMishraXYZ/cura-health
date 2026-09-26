import React from 'react';
import { Appointment } from '../../types';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  QrCode, 
  Download, 
  ArrowRight, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DoctorAvatar } from '../common/DoctorAvatar';

interface BookingSuccessModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ appointment, onClose }) => {
  const { setActiveVideoCall, setActiveTab } = useApp();

  const handleDownloadCalendar = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cura Health//Doctor Appointment//EN
BEGIN:VEVENT
UID:${appointment.id}@curahealth.ai
DTSTAMP:20260926T100000Z
DTSTART:20260927T093000Z
DTEND:20260927T100000Z
SUMMARY:Consultation with ${appointment.doctorName}
DESCRIPTION:Cura Health AI Consultation - ${appointment.doctorSpecialty}. Reason: ${appointment.symptomsNote}
LOCATION:Cura Health Telehealth Video Room
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CuraHealth_Appointment_${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJoinCall = () => {
    onClose();
    setActiveVideoCall(appointment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#11141E] border border-[#202738] rounded-3xl p-6 shadow-2xl space-y-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Booking Confirmed!</span>
          <h3 className="text-lg font-bold text-white mt-0.5">Appointment Pass Generated</h3>
          <p className="text-xs text-slate-400 mt-1">Ref ID: <span className="font-mono text-slate-200 font-semibold">{appointment.id}</span></p>
        </div>

        {/* Digital Pass Card */}
        <div className="bg-[#151926] border border-[#22293C] rounded-2xl p-4 text-left space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DoctorAvatar
                name={appointment.doctorName}
                initials={appointment.doctorInitials}
                avatarUrl={appointment.doctorAvatar}
                size="sm"
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {appointment.doctorName}
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </h4>
                <p className="text-[11px] text-slate-400">{appointment.doctorSpecialty}</p>
              </div>
            </div>

            <div className="p-2 bg-[#1B2132] rounded-xl border border-[#262F44] text-slate-300" title="Clinic QR Check-in">
              <QrCode className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1C2232]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Scheduled Date</span>
              <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {appointment.dateStr}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Time Slot</span>
              <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {appointment.slotTime}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2232] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Patient: <strong className="text-slate-200">{appointment.patientName}</strong></span>
            <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Paid ${appointment.consultationFee}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {appointment.type === 'video' && (
            <button
              onClick={handleJoinCall}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Simulate Telehealth Video Call</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadCalendar}
              className="py-2.5 px-3 bg-[#161B28] hover:bg-[#1E2536] text-slate-200 text-xs font-medium rounded-xl border border-[#22293C] transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Add to Calendar</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setActiveTab('appointments');
              }}
              className="py-2.5 px-3 bg-[#161B28] hover:bg-[#1E2536] text-slate-200 text-xs font-medium rounded-xl border border-[#22293C] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Bookings</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
