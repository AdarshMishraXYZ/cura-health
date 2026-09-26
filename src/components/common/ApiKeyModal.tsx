import React, { useState } from 'react';
import { Sparkles, Key, Check, X, ExternalLink, ShieldCheck, Zap, Bot } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, isLiveLLMEnabled } from '../../services/geminiAgentService';

interface ApiKeyModalProps {
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
  const [keyInput, setKeyInput] = useState(getGeminiApiKey());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(keyInput.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    setGeminiApiKey('');
    setKeyInput('');
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const isLive = isLiveLLMEnabled();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141721] border border-[#242C3F] rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Engine & LLM Settings</h3>
              <p className="text-[10px] text-slate-400">Configure Live Generative AI / Agentic Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Mode Banner */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isLive
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-blue-950/20 border-blue-500/30 text-blue-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                {isLive ? 'Live Gemini 1.5/2.0 Flash LLM Active' : 'Clinical Neuro-Inference Agent Active'}
              </span>
              <p className="text-[10px] text-slate-300">
                {isLive 
                  ? 'All triage & chats are generated live by Google Gemini API'
                  : 'Running on embedded clinical multi-agent reasoning'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10">
            {isLive ? 'Live Cloud' : 'Autonomous'}
          </span>
        </div>

        {/* Key Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Key className="w-3 h-3 text-amber-400" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Your key is stored securely in your browser's private <code className="text-blue-300">localStorage</code>.
            </p>
          </div>

          {savedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              AI Engine configuration successfully updated!
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {keyInput && (
              <button
                type="button"
                onClick={handleRemove}
                className="py-2 px-3 bg-slate-800 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-semibold"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              {keyInput ? 'Save & Connect Gemini LLM' : 'Close'}
            </button>
          </div>
        </form>

        {/* Feature Highlights */}
        <div className="p-3 bg-[#0F1117] rounded-2xl border border-white/5 space-y-1.5 text-[10px] text-slate-400">
          <p className="text-white font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Agentic AI Capabilities:
          </p>
          <p>• Zero static fallbacks: Dynamic clinical differential reasoning on any symptom.</p>
          <p>• Multi-specialty diagnostic matrix across all 10 medical categories.</p>
          <p>• Real-time pharmacovigilance and drug interaction checking.</p>
        </div>
      </div>
    </div>
  );
};
