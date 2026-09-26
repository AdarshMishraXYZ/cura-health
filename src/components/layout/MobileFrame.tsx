import React from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobilePreview, setIsMobilePreview } = useApp();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-start p-0 md:py-6 md:px-4">
      {/* Top Device Viewport Switcher Toolbar */}
      <div className="w-full max-w-5xl mb-4 px-4 py-2 flex items-center justify-between bg-[#121620] border border-[#1E2536] rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30 text-sm">
            C+
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              Cura Health <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">AI Clinical Suite</span>
            </h1>
            <p className="text-[11px] text-slate-400">AI Medical Triage, Intelligent Diagnostics & Doctor Booking</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#0B0E16] p-1 rounded-xl border border-[#1E2638]">
          <button
            onClick={() => setIsMobilePreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMobilePreview 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App View</span>
          </button>
          <button
            onClick={() => setIsMobilePreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMobilePreview 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Desktop View</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      {isMobilePreview ? (
        <div className="relative w-full max-w-[430px] h-[910px] bg-[#0F1117] md:rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 md:border-[10px] md:border-[#1E2330] overflow-hidden flex flex-col ring-1 ring-white/10">
          {/* Simulated Mobile Status Bar matching screenshot (01:45, 5G, battery) */}
          <div className="h-10 px-6 pt-2 pb-1 flex items-center justify-between text-xs text-slate-400 select-none bg-[#0F1117] z-30 shrink-0">
            <span className="font-semibold text-slate-200 text-[13px] tracking-tight">01:45</span>
            {/* Camera pill notch */}
            <div className="w-20 h-4 bg-[#1A1F2D] rounded-full mx-auto hidden md:block"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold">43</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0F1117]">
            {children}
          </div>

          {/* Android / iOS home indicator bar */}
          <div className="h-3 w-full bg-[#0F1117] flex items-center justify-center shrink-0 pb-1">
            <div className="w-32 h-1 bg-slate-700/60 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl min-h-[850px] bg-[#0F1117] rounded-3xl border border-[#1E2436] shadow-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
