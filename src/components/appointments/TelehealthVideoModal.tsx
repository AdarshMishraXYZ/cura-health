import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../../types';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Download,
  Image as ImageIcon,
  Paperclip,
  CheckCircle2
} from 'lucide-react';

interface TelehealthVideoModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const TelehealthVideoModal: React.FC<TelehealthVideoModalProps> = ({ appointment, onClose }) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [activeSidePanel, setActiveSidePanel] = useState<'notes' | 'rx' | 'media'>('notes');
  const [sharedImages, setSharedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop'
  ]);
  const [doctorNotes, setDoctorNotes] = useState<string>(
    `Patient presents with: ${appointment.symptomsNote}.\nVital signs: Stable.\nDiagnosis: Acute viral pharyngitis with mild low-grade pyrexia.\nTreatment protocol initiated.`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSharedImages(prev => [reader.result as string, ...prev]);
        setActiveSidePanel('media');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadRx = () => {
    const rxText = `=====================================================
CURA HEALTH TELEHEALTH CLINICAL PRESCRIPTION
Date: ${new Date().toLocaleDateString()}
Doctor: ${appointment.doctorName} (${appointment.doctorSpecialty})
Patient: ${appointment.patientName}
Appointment Ref: #${appointment.id}
=====================================================

DIAGNOSIS & CLINICAL OBSERVATION:
${doctorNotes}

Rx / MEDICATIONS:
1. Paracetamol 500mg - 1 tablet every 6 hours as needed for fever/pain.
2. Warm Saline Gargle - 3 times daily.
3. Vitamin C + Zinc Chewable - 1 daily after breakfast for 7 days.
4. Cholecalciferol (Vitamin D3) 60,000 IU - 1 capsule weekly for 8 weeks.

ADVICE:
- Ample hydration (minimum 2.5L water/fluids daily).
- Rest in quiet, well-ventilated room.
- Follow up in 3 days if fever persists beyond 101°F.

Digitally Verified & Signed:
${appointment.doctorName}, MBBS
License #CH-MD-${appointment.doctorId}
=====================================================`;

    const blob = new Blob([rxText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Prescription_${appointment.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-[88vh] bg-[#0E1119] border border-[#202738] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Video Call Area */}
        <div className="flex-1 flex flex-col relative bg-[#090C12] border-r border-[#1B2232]">
          {/* Top Bar inside Call */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-white font-mono font-medium">{formatTime(seconds)}</span>
              <span className="text-slate-400">· HD Encrypted</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                title="Share photo or document with doctor"
              >
                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                <span>Share Image / Rx</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Simulated Doctor Video Screen */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6">
            <div className="relative text-center">
              <div className="relative mx-auto mb-4">
                {appointment.doctorAvatar ? (
                  <img
                    src={appointment.doctorAvatar}
                    alt={appointment.doctorName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/50 shadow-2xl shadow-blue-500/20"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#182846] border-4 border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-3xl shadow-2xl shadow-blue-500/20">
                    {appointment.doctorInitials}
                  </div>
                )}
                <div className="absolute -inset-2 rounded-full border border-blue-400/30 animate-pulse pointer-events-none"></div>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-lg font-bold text-white">{appointment.doctorName}</h3>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xs text-blue-300 font-medium">{appointment.doctorSpecialty}</p>

              <div className="flex items-center justify-center gap-1 mt-3 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Connected & Speaking</span>
              </div>
            </div>

            {/* Picture-in-Picture Patient Camera Box */}
            <div className="absolute bottom-20 right-4 w-32 h-24 bg-[#141926] border border-blue-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-2 text-center">
              {isVideoOn ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center mb-1">
                    You
                  </div>
                  <span className="text-[10px] text-slate-300 truncate font-medium">{appointment.patientName}</span>
                </>
              ) : (
                <div className="text-[10px] text-slate-500 flex flex-col items-center">
                  <VideoOff className="w-4 h-4 mb-1" />
                  <span>Camera off</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="h-18 bg-[#0B0E16]/90 backdrop-blur-md border-t border-[#1C2232] flex items-center justify-center gap-3 px-4 z-20">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                isMicOn 
                  ? 'bg-[#1C2232] text-white hover:bg-[#252E44]' 
                  : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                isVideoOn 
                  ? 'bg-[#1C2232] text-white hover:bg-[#252E44]' 
                  : 'bg-rose-600 text-white'
              }`}
              title={isVideoOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform active:scale-95 shadow-lg shadow-rose-600/40 cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side Clinical Notes, e-Prescription & Shared Media Drawer */}
        <div className="w-full md:w-80 bg-[#121622] p-4 flex flex-col space-y-3">
          {/* Sub Drawer Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1C2232]">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveSidePanel('notes')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  activeSidePanel === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveSidePanel('rx')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  activeSidePanel === 'rx' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rx Pad
              </button>
              <button
                onClick={() => setActiveSidePanel('media')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  activeSidePanel === 'media' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Media ({sharedImages.length})
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeSidePanel === 'notes' && (
            <div className="flex-1 flex flex-col space-y-3">
              <p className="text-[11px] text-slate-400">
                Doctor's synchronized diagnosis notes during the active telehealth session:
              </p>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={10}
                className="w-full flex-1 bg-[#181D2A] text-xs text-slate-200 p-3 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500 leading-relaxed resize-none font-mono"
              />
              <button
                onClick={() => setActiveSidePanel('rx')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Review Digital Prescription
              </button>
            </div>
          )}

          {activeSidePanel === 'rx' && (
            <div className="flex-1 flex flex-col space-y-3 text-xs">
              <div className="bg-[#181D2A] p-3 rounded-xl border border-[#232B3D] space-y-2">
                <span className="text-[10px] text-blue-400 font-bold uppercase block tracking-wider">Prescribed Meds</span>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <p>💊 <strong>Paracetamol 500mg</strong> · 1 tab tid (3 days)</p>
                  <p>💊 <strong>Vitamin D3 60k</strong> · 1 cap weekly (8 weeks)</p>
                  <p>💧 <strong>Saline Gargle</strong> · 3 times daily</p>
                </div>
              </div>

              <div className="p-3 bg-[#151926] rounded-xl border border-[#202738] text-[11px] text-slate-400 space-y-1">
                <p>Digital Rx Verified by: <strong className="text-slate-200">{appointment.doctorName}</strong></p>
                <p>Clinic: <span className="text-slate-300">Cura Telehealth Pavilion</span></p>
              </div>

              <button
                onClick={handleDownloadRx}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 mt-auto shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download e-Prescription</span>
              </button>
            </div>
          )}

          {activeSidePanel === 'media' && (
            <div className="flex-1 flex flex-col space-y-3 text-xs">
              <p className="text-[11px] text-slate-400">
                Shared during call (visible to Dr. {appointment.doctorName.split(' ')[1]}):
              </p>
              <div className="space-y-2 overflow-y-auto max-h-[300px]">
                {sharedImages.map((imgUrl, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-[#222B3D] relative group">
                    <img src={imgUrl} alt={`Shared asset ${idx + 1}`} className="w-full h-32 object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 px-2 py-0.5 rounded text-[9px] text-white">
                      File #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 mt-auto cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                Upload Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
