import React, { useState } from 'react';
import { Activity, Sparkles, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { SpecialtyId } from '../../types';

interface BodyRegion {
  id: string;
  name: string;
  specialtyId: SpecialtyId;
  specialtyName: string;
  symptoms: string[];
  icon: string;
}

const REGIONS: BodyRegion[] = [
  {
    id: 'head',
    name: 'Head & Brain',
    specialtyId: 'neurologist',
    specialtyName: 'Neurologist',
    symptoms: ['Migraine / Headache', 'Dizziness & Vertigo', 'Light Sensitivity', 'Brain Fog'],
    icon: '🧠'
  },
  {
    id: 'throat',
    name: 'Throat & Neck',
    specialtyId: 'ent',
    specialtyName: 'ENT Specialist',
    symptoms: ['Sore Throat', 'Difficulty Swallowing', 'Swollen Glands', 'Voice Loss'],
    icon: '🗣️'
  },
  {
    id: 'chest',
    name: 'Chest & Heart',
    specialtyId: 'cardiologist',
    specialtyName: 'Cardiologist',
    symptoms: ['Chest Tightness', 'Palpitations', 'Shortness of Breath', 'Irregular Heartbeat'],
    icon: '🫀'
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Gut',
    specialtyId: 'gastroenterologist',
    specialtyName: 'Gastroenterologist',
    symptoms: ['Acid Reflux / GERD', 'Stomach Cramps', 'Severe Bloating', 'Nausea / Indigestion'],
    icon: '🫄'
  },
  {
    id: 'back',
    name: 'Spine & Back',
    specialtyId: 'orthopedist',
    specialtyName: 'Orthopedist',
    symptoms: ['Lower Back Pain', 'Sciatica', 'Stiff Neck', 'Muscle Spasms'],
    icon: '🦴'
  },
  {
    id: 'arms',
    name: 'Arms & Hands',
    specialtyId: 'orthopedist',
    specialtyName: 'Orthopedist',
    symptoms: ['Joint Pain / Arthritis', 'Numbness / Tingling', 'Carpal Tunnel', 'Wrist Sprain'],
    icon: '💪'
  },
  {
    id: 'legs',
    name: 'Knees & Legs',
    specialtyId: 'orthopedist',
    specialtyName: 'Orthopedist',
    symptoms: ['Knee Pain / Crepitus', 'Swelling / Edema', 'Calf Cramps', 'Ankle Sprain'],
    icon: '🦵'
  },
  {
    id: 'skin',
    name: 'Skin & Surface',
    specialtyId: 'dermatologist',
    specialtyName: 'Dermatologist',
    symptoms: ['Itchy Rash / Eczema', 'Acne Flare-up', 'Dry Patches / Hives', 'Unusual Mole'],
    icon: '✨'
  },
];

interface BodyMapSelectorProps {
  onAnalyze: (symptoms: string) => void;
}

export const BodyMapSelector: React.FC<BodyMapSelectorProps> = ({ onAnalyze }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('head');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Migraine / Headache']);

  const activeRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleTriggerAnalysis = () => {
    if (selectedSymptoms.length === 0) return;
    const prompt = `I am experiencing symptoms in my ${activeRegion.name}: ${selectedSymptoms.join(', ')}.`;
    onAnalyze(prompt);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
            <Activity className="w-3.5 h-3.5" />
            Interactive Triage
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">2D Anatomical Body Map</h2>
          <p className="text-xs text-slate-400">Tap a body zone to localize symptoms and route to the right specialist</p>
        </div>
        <button 
          onClick={() => { setSelectedSymptoms([]); }}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-[#1A1F2E] px-2.5 py-1.5 rounded-lg border border-[#252C3E]"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Main Grid: Body Silhouette Zone Picker & Details */}
      <div className="bg-[#141721] border border-[#202534] rounded-2xl p-4 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Zone Selection Chips */}
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block mb-2.5">
            Select Body Region
          </span>
          <div className="grid grid-cols-2 gap-2">
            {REGIONS.map((region) => {
              const isSelected = region.id === selectedRegionId;
              return (
                <button
                  key={region.id}
                  onClick={() => {
                    setSelectedRegionId(region.id);
                    // auto-select first symptom if empty
                    if (selectedSymptoms.length === 0) {
                      setSelectedSymptoms([region.symptoms[0]]);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                      : 'bg-[#181C28] border-[#222938] text-slate-300 hover:border-slate-600 hover:bg-[#1C2130]'
                  }`}
                >
                  <span className="text-lg">{region.icon}</span>
                  <div className="truncate">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                      {region.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {region.specialtyName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Region-Specific Symptoms List */}
        <div className="bg-[#181D2A] border border-[#242C3F] rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{activeRegion.icon}</span>
                <h3 className="text-sm font-bold text-white">{activeRegion.name} Symptoms</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-medium">
                {activeRegion.specialtyName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Select all symptoms you are currently feeling:</p>

            <div className="space-y-1.5">
              {activeRegion.symptoms.map((symptom) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-blue-600/25 border-blue-500/40 text-blue-200 font-medium'
                        : 'bg-[#131620] border-[#202534] text-slate-300 hover:bg-[#1A1F2C]'
                    }`}
                  >
                    <span>{symptom}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-600 bg-slate-800'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active summary */}
          <div className="mt-4 pt-3 border-t border-[#242C3F]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Selected ({selectedSymptoms.length})</span>
              <span className="text-emerald-400 font-medium">Triage Ready</span>
            </div>

            <button
              onClick={handleTriggerAnalysis}
              disabled={selectedSymptoms.length === 0}
              className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedSymptoms.length > 0
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:opacity-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Symptoms with AI
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
