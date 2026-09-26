import React, { useState } from 'react';
import { 
  Stethoscope, 
  Brain, 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeSymptomsWithAi } from '../../services/aiTriageService';
import { PRESET_SYMPTOMS } from '../../data/sampleSymptoms';
import { SymptomAnalysisResult } from '../../types';
import { SpecialtyIcon } from '../common/SpecialtyIcon';

export const SymptomAnalyzer: React.FC = () => {
  const { navigateToSpecialty, setActiveTab } = useApp();

  const [symptomsText, setSymptomsText] = useState<string>(
    "I've had a persistent headache with light sensitivity for the past 3 days."
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>({
    symptoms: "I've had a persistent headache with light sensitivity for the past 3 days.",
    suggestedSpecialtyId: 'neurologist',
    suggestedSpecialtyName: 'Neurologist',
    matchScore: 96,
    urgencyLevel: 'moderate',
    reasoning: 'The symptoms of persistent headache combined with light sensitivity (photophobia) are hallmark clinical indicators of neurological involvement, such as migraine with aura or intracranial pressure anomalies.',
    recommendations: [
      'Rest in a quiet, darkened room away from screens.',
      'Maintain adequate hydration and monitor blood pressure.',
      'Seek emergency evaluation if headache becomes sudden, thunderclap, or causes stiff neck.'
    ],
    disclaimer: 'Assists triage only — not a medical diagnosis.'
  });

  const [isListening, setIsListening] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!symptomsText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeSymptomsWithAi(symptomsText);
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSimulateVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setSymptomsText("Sore throat, mild fever, and dry cough since yesterday afternoon.");
      setIsListening(false);
    }, 1800);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Section Header matching Screenshot 3 */}
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Clinical AI Triage</span>
        <h2 className="text-lg font-bold text-white tracking-tight">AI Symptom Analyzer & Triage</h2>
      </div>

      {/* Main Symptom Analyzer Card */}
      <div className="bg-[#121622] border border-[#1E2536] rounded-2xl p-4 shadow-lg space-y-3.5">
        {/* Header Icon + Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI symptom analyzer</h3>
          </div>

          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online Triage v2.4
          </span>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            rows={3}
            placeholder="Describe your symptoms, how long you've had them, and their severity..."
            className="w-full bg-[#181D2A] text-sm text-slate-100 placeholder-slate-500 p-3 rounded-xl border border-[#232A3B] focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
          />

          {/* Voice input button */}
          <button
            type="button"
            onClick={handleSimulateVoice}
            className={`absolute right-2.5 bottom-3 p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              isListening
                ? 'bg-rose-600/30 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-[#212738] text-slate-400 hover:text-white hover:bg-[#283044]'
            }`}
            title="Dictate symptoms"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{isListening ? 'Listening...' : 'Voice'}</span>
          </button>
        </div>

        {/* Quick Example Symptom Pills */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium">Quick symptom scenarios:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_SYMPTOMS.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSymptomsText(item.query)}
                className="text-[11px] bg-[#181D2A] hover:bg-[#202738] text-slate-300 border border-[#232B3D] px-2.5 py-1 rounded-lg transition-colors text-left truncate max-w-[200px]"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Analyze Symptoms Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !symptomsText.trim()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing clinical symptoms...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze symptoms</span>
            </>
          )}
        </button>
      </div>

      {/* Suggested Specialty Result Section matching Screenshot 3 */}
      {result && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Suggested specialty
            </span>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {result.matchScore}% Match
            </span>
          </div>

          {/* Specialty Highlight Card matching Screenshot 3 */}
          <div className="bg-[#122038] border border-blue-600/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg shadow-blue-950/40">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-400 flex items-center justify-center shrink-0">
              <SpecialtyIcon id={result.suggestedSpecialtyId} className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight">
                {result.suggestedSpecialtyName}
              </h3>
              <p className="text-xs text-blue-200/90 font-medium">
                Best match for these symptoms
              </p>
            </div>
          </div>

          {/* AI Clinical Insight & Recommendations */}
          <div className="bg-[#121622] border border-[#1E2536] rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Triage Analysis</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {result.reasoning}
            </p>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="pt-2 border-t border-[#1C2232] space-y-1.5">
                <p className="font-semibold text-slate-300 text-[11px]">Recommended next steps:</p>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Disclaimer matching Screenshot 3 */}
          <p className="text-[11px] text-center text-slate-500 italic">
            {result.disclaimer}
          </p>

          {/* Action button: View neurologists near you matching Screenshot 3 */}
          <button
            onClick={() => navigateToSpecialty(result.suggestedSpecialtyId)}
            className="w-full py-3 px-4 bg-[#141824] hover:bg-[#1A2030] text-slate-200 hover:text-white font-medium rounded-xl text-xs border border-[#22283A] hover:border-blue-500/40 transition-all flex items-center justify-center gap-2"
          >
            <span>View {result.suggestedSpecialtyName.toLowerCase()}s near you</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      )}
    </div>
  );
};
