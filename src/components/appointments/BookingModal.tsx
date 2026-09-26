import React, { useState } from 'react';
import { Doctor, ConsultationType, Appointment } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { DoctorAvatar } from '../common/DoctorAvatar';

interface BookingModalProps {
  doctor: Doctor;
  initialDate: string;
  initialSlot: string;
  onClose: () => void;
  onSuccess: (apt: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  initialDate,
  initialSlot,
  onClose,
  onSuccess
}) => {
  const { createAppointment } = useApp();

  const [consultationType, setConsultationType] = useState<ConsultationType>('video');
  const [patientName, setPatientName] = useState<string>('Alex Mercer');
  const [patientEmail, setPatientEmail] = useState<string>('alex.mercer@example.com');
  const [patientPhone, setPatientPhone] = useState<string>('+1 (555) 349-2180');
  const [symptomsNote, setSymptomsNote] = useState<string>('Consultation and clinical evaluation');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newApt = createAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialtyName,
        doctorInitials: doctor.initials,
        doctorAvatar: doctor.avatarUrl,
        dateStr: initialDate,
        slotTime: initialSlot,
        consultationFee: doctor.consultationFee,
        type: consultationType,
        patientName,
        patientEmail,
        patientPhone,
        symptomsNote
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSubmitting(false);
      onSuccess(newApt);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#11141E] border border-[#202738] rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-2xl max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
          <div>
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Checkout</span>
            <h3 className="text-base font-bold text-white">Confirm Appointment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181D2A] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Summary banner */}
        <div className="bg-[#151926] border border-[#22293C] rounded-2xl p-3.5 my-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DoctorAvatar
              name={doctor.name}
              initials={doctor.initials}
              avatarUrl={doctor.avatarUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-white font-bold text-sm">{doctor.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-xs text-slate-400">{doctor.specialtyName}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-blue-400 font-medium">
                <Calendar className="w-3 h-3" />
                <span>{initialDate}</span>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{initialSlot}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-white">${doctor.consultationFee}</span>
            <p className="text-[10px] text-emerald-400">Instant confirm</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consultation Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Consultation Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConsultationType('video')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  consultationType === 'video'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm'
                    : 'bg-[#151926] border-[#22293C] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4 text-blue-400" />
                <span className="text-xs">Telehealth</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('in-person')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  consultationType === 'in-person'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm'
                    : 'bg-[#151926] border-[#22293C] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs">In-Clinic</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('audio')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  consultationType === 'audio'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm'
                    : 'bg-[#151926] border-[#22293C] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-xs">Audio Call</span>
              </button>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Patient Information
            </label>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#181D2A] text-xs text-white p-2.5 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full bg-[#181D2A] text-xs text-white p-2.5 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-[#181D2A] text-xs text-white p-2.5 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Reason / Symptoms for visit</label>
              <textarea
                rows={2}
                value={symptomsNote}
                onChange={(e) => setSymptomsNote(e.target.value)}
                placeholder="Briefly state reason for appointment..."
                className="w-full bg-[#181D2A] text-xs text-white p-2.5 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Pricing summary */}
          <div className="bg-[#151926] p-3 rounded-xl border border-[#202738] space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Doctor Consultation Fee</span>
              <span>${doctor.consultationFee}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>AI Triage & Booking Fee</span>
              <span className="text-emerald-400 font-medium">Free ($0)</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-1.5 border-t border-[#1F2636] text-sm">
              <span>Total Amount</span>
              <span className="text-blue-400">${doctor.consultationFee}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Finalizing appointment...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay ${doctor.consultationFee}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
