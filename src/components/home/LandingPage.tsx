import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  BrainCircuit, 
  Video, 
  User, 
  Stethoscope, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setSelectedSpecialtyId } = useApp();

  const handleStartTriage = () => {
    setActiveTab('symptom-ai');
  };

  const handleBrowseDoctors = (specialtyId?: any) => {
    if (specialtyId) {
      setSelectedSpecialtyId(specialtyId);
    }
    setActiveTab('doctors');
  };

  const handleEnterDoctorView = () => {
    setActiveTab('clinician-view');
  };

  return (
    <div className="relative overflow-hidden text-slate-100">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-60 right-0 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-16">
        
        {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Brand & Dual Role Experience Cards */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              Cura Health
            </h1>

            {/* Dual Role Experience Cards (Positioned at Top) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Patient Card */}
              <div 
                onClick={handleStartTriage}
                className="bg-gradient-to-br from-[#121727] to-[#101420] border border-cyan-500/30 rounded-2xl p-4 space-y-2.5 cursor-pointer hover:border-cyan-400 transition-all shadow-xl group hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                    For Patients
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Patient Health Experience
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Check symptoms with Gemini AI, find doctor profiles, schedule appointments, and generate digital appointment passes with QR code check-in.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:gap-2 transition-all">
                    Open Patient Portal <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Doctor Card */}
              <div 
                onClick={handleEnterDoctorView}
                className="bg-gradient-to-br from-[#121727] to-[#101420] border border-emerald-500/30 rounded-2xl p-4 space-y-2.5 cursor-pointer hover:border-emerald-400 transition-all shadow-xl group hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    For Clinicians
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Clinician Workstation
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  View today's patient queue, review symptoms and triage summaries, manage appointment statuses, and issue digital prescriptions.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:gap-2 transition-all">
                    Enter Doctor Workstation <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Floating AI Triage Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md relative group">
              {/* Card Glow Underlay */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

              {/* Main Floating Glass Container */}
              <div className="relative rounded-3xl bg-[#111624]/90 border border-cyan-500/30 p-5 backdrop-blur-xl shadow-2xl space-y-4 text-left">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-1 border-b border-[#1D253A]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                      <BrainCircuit className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Interactive AI symptom triage dialog</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Live Model
                  </span>
                </div>

                {/* Patient Query Simulation */}
                <div className="bg-[#161D2E] border border-[#222B42] rounded-2xl p-3 text-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Patient Symptoms</span>
                  <p className="text-slate-200 italic font-medium">
                    "Severe sharp right knee pain and foot stiffness when walking down stairs for 3 days."
                  </p>
                </div>

                {/* AI Diagnosis Result Card (matching mockup) */}
                <div className="bg-[#131826] border border-cyan-500/40 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 tracking-wide">Diagnosis Triage</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      94% Match
                    </span>
                  </div>

                  {/* Specialist Match */}
                  <div className="flex items-center gap-3 pt-1">
                    <img 
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150" 
                      alt="Doctor" 
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        Dr. Marcus Vance
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </h4>
                      <p className="text-[11px] font-semibold text-cyan-400">Orthopedist Specialist</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Clinical triage indicates musculoskeletal etiology with patellofemoral tracking concern. Recommended for orthopedic physical exam and imaging.
                  </p>

                  {/* Direct Action Button */}
                  <button
                    onClick={() => handleBrowseDoctors('orthopedist')}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Book Consult</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── HOW IT WORKS (3-Step Section) ─────────────────────────────────── */}
        <div className="pt-6 space-y-8 text-center">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">How It Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
              From natural language symptoms to verified doctor consultation in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Step 1 */}
            <div 
              onClick={handleStartTriage}
              className="bg-[#111624]/90 border border-[#20293D] hover:border-cyan-500/50 rounded-3xl p-6 space-y-4 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                1. Describe Symptoms
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe how you feel in plain language or use hands-free voice dictation with the Web Speech API. No medical terminology needed.
              </p>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 pt-1">
                Start Triage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => handleBrowseDoctors()}
              className="bg-[#111624]/90 border border-[#20293D] hover:border-blue-500/50 rounded-3xl p-6 space-y-4 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                2. Intelligent AI Routing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 2.5 Flash analyzes anatomical and clinical markers, assigning an urgency score and routing to 1 of 9 board-certified specialties.
              </p>
              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 pt-1">
                Explore Specialties <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => handleBrowseDoctors()}
              className="bg-[#111624]/90 border border-[#20293D] hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                3. Book & Telehealth Video
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reserve your slot with PostgreSQL transaction locking to guarantee zero double-bookings, then attend an interactive telehealth consultation.
              </p>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                View Available Slots <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
