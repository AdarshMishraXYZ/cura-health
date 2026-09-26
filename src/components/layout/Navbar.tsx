import React from 'react';
import { Sparkles, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-[#0F1117]/95 backdrop-blur-md border-b border-[#1A1F2C] px-4 py-3">
      {/* Sleek Top Header - Single point of identity without redundant navigation */}
      <div className="flex items-center justify-between">
        {/* Brand identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => setActiveTab('doctors')}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">Cura Health</span>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/15 px-1.5 py-0.2 rounded border border-blue-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Clinical Triage & Care</p>
          </div>
        </div>

        {/* Live Clinical AI Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141824] px-2.5 py-1 rounded-full border border-[#222838]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-medium text-slate-300">Smart AI Online</span>
          </div>

          <button
            onClick={() => setActiveTab('symptom-ai')}
            className="p-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition-colors"
            title="Instant Triage"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
