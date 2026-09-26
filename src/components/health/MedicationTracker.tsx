import React, { useState } from 'react';
import { Check, Plus, Trash2, Flame, Bell, Calendar, Sparkles } from 'lucide-react';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: 'Prescription' | 'OTC' | 'Supplement';
  timeSlots: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  taken: boolean;
  streakDays: number;
}

const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Vitamin D3 (Cholecalciferol)',
    dosage: '60,000 IU',
    frequency: 'Once weekly',
    category: 'Supplement',
    timeSlots: ['Morning'],
    taken: true,
    streakDays: 4,
  },
  {
    id: 'med-2',
    name: 'Paracetamol (Acetaminophen)',
    dosage: '500 mg',
    frequency: 'Every 8 hours as needed',
    category: 'OTC',
    timeSlots: ['Morning', 'Evening'],
    taken: false,
    streakDays: 2,
  },
  {
    id: 'med-3',
    name: 'Omega-3 Fish Oil',
    dosage: '1000 mg',
    frequency: 'Daily with meal',
    category: 'Supplement',
    timeSlots: ['Afternoon'],
    taken: true,
    streakDays: 12,
  },
];

export const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('cura_medications');
      return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
    } catch {
      return INITIAL_MEDICATIONS;
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFreq, setNewFreq] = useState('Daily');
  const [newCategory, setNewCategory] = useState<'Prescription' | 'OTC' | 'Supplement'>('OTC');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTaken = (id: string) => {
    setMedications(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          const willBeTaken = !m.taken;
          return {
            ...m,
            taken: willBeTaken,
            streakDays: willBeTaken ? m.streakDays + 1 : Math.max(0, m.streakDays - 1)
          };
        }
        return m;
      });
      localStorage.setItem('cura_medications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMed = (id: string) => {
    setMedications(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('cura_medications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: newName.trim(),
      dosage: newDosage.trim() || 'Standard Dose',
      frequency: newFreq,
      category: newCategory,
      timeSlots: ['Morning'],
      taken: false,
      streakDays: 0,
    };

    setMedications(prev => {
      const updated = [newMed, ...prev];
      localStorage.setItem('cura_medications', JSON.stringify(updated));
      return updated;
    });

    setNewName('');
    setNewDosage('');
    setShowAddModal(false);
    showToast(`Added ${newMed.name} to pill tracker!`);
  };

  const takenCount = medications.filter(m => m.taken).length;
  const adherenceRate = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Adherence Hub
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Daily Medication Tracker</h2>
          <p className="text-xs text-slate-400">Track daily dosages, maintain your streak & log intake</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Pill
        </button>
      </div>

      {/* Adherence Summary Card */}
      <div className="bg-gradient-to-br from-[#141824] to-[#182033] border border-[#232D42] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-white">Today's Adherence Rate</span>
            <p className="text-[11px] text-slate-400">
              {takenCount} of {medications.length} medicines logged today
            </p>
          </div>
          <div className="text-right">
            <span className={`text-xl font-black ${
              adherenceRate === 100 ? 'text-emerald-400' : adherenceRate >= 50 ? 'text-blue-400' : 'text-amber-400'
            }`}>
              {adherenceRate}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#0F1117] h-2.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${adherenceRate}%` }}
          />
        </div>

        {/* Reminders Button */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Bell className="w-3 h-3 text-blue-400" />
            Push notification alerts enabled for scheduled hours
          </span>
          <button
            onClick={() => showToast('🔔 Daily reminders scheduled at 9:00 AM & 8:00 PM')}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
          >
            Configure
          </button>
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Scheduled Doses ({medications.length})
        </h3>

        {medications.map((med) => (
          <div
            key={med.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              med.taken
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-[#141721] border-[#202534] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox circle */}
              <button
                onClick={() => toggleTaken(med.id)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  med.taken
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-[#181D2A] border-slate-600 text-transparent hover:border-blue-400'
                }`}
              >
                <Check className={`w-4 h-4 ${med.taken ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              {/* Medication info */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className={`text-xs font-bold ${med.taken ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {med.name}
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#1F273B] text-slate-300 font-medium border border-white/5">
                    {med.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {med.dosage} · <span className="text-slate-300">{med.frequency}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {med.timeSlots.map((slot, sIdx) => (
                    <span key={sIdx} className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300">
                      {slot}
                    </span>
                  ))}
                  {med.streakDays > 0 && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {med.streakDays}d streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteMed(med.id)}
              className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {medications.length === 0 && (
          <div className="text-center py-8 bg-[#141721] rounded-2xl border border-[#202534] p-6">
            <p className="text-xs text-slate-400 mb-2">No medications logged in your tracker.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              + Add your first medication
            </button>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141721] border border-[#242C3F] rounded-2xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Add New Medication</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMed} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Amoxicillin, Cetirizine..."
                  className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Dosage & Strength</label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g., 500mg, 1 tablet"
                  className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Frequency</label>
                  <select
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As Needed">As Needed (SOS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Type</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="OTC">OTC</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Supplement">Supplement</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
