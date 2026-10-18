import React, { useState } from 'react';
import { Stethoscope, UserCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApiKeyModal } from '../common/ApiKeyModal';
import { isLiveLLMEnabled } from '../../services/geminiAgentService';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const isLive = isLiveLLMEnabled();

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#0F1117]/95 backdrop-blur-md border-b border-[#1A1F2C] px-3.5 py-2.5">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-tight">Cura Health</span>
                <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.2 rounded border border-blue-500/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Clinical Triage & Telehealth</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live LLM Status Indicator */}
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                isLive
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
              }`}
              title="Configure LLM API & Agentic Engine"
            >
              <Zap className={`w-3 h-3 ${isLive ? 'text-emerald-400 fill-emerald-400 animate-pulse' : 'text-blue-400'}`} />
              <span className="hidden xs:inline">{isLive ? 'Gemini Live' : 'AI Engine'}</span>
            </button>

            {/* Clinician View Switcher */}
            <button
              onClick={() => setActiveTab(activeTab === 'clinician-view' ? 'doctors' : 'clinician-view')}
              className={`px-2 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                activeTab === 'clinician-view'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-[#141824] hover:bg-[#1A2030] text-slate-300 border-[#222838]'
              }`}
              title="Toggle Doctor Workstation Perspective"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Doctor View</span>
            </button>
          </div>
        </div>
      </header>

      {/* API Key & AI Engine Modal */}
      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />
      )}
    </>
  );
};
