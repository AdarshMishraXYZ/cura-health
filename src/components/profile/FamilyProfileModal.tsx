import React, { useState } from 'react';
import { useApp, FamilyProfile } from '../../context/AppContext';
import { Users, Plus, Check, Trash2, X, Heart } from 'lucide-react';

interface FamilyProfileModalProps {
  onClose: () => void;
}

export const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({ onClose }) => {
  const { familyProfiles, activeFamilyProfile, setActiveFamilyProfile, addFamilyProfile, removeFamilyProfile } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<'Child' | 'Parent' | 'Spouse' | 'Other'>('Child');
  const [age, setAge] = useState<number>(10);
  const [bloodGroup, setBloodGroup] = useState('O+');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ['bg-purple-600', 'bg-pink-600', 'bg-amber-600', 'bg-teal-600', 'bg-indigo-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    addFamilyProfile({
      name: name.trim(),
      relation,
      age: Number(age) || 20,
      bloodGroup,
      avatarInitials: initials || 'FM',
      avatarColor: randomColor,
    });

    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141721] border border-[#242C3F] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Family Profiles</h3>
              <p className="text-[10px] text-slate-400">Manage dependent health records</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Profile Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white ${activeFamilyProfile.avatarColor}`}>
              {activeFamilyProfile.avatarInitials}
            </div>
            <div>
              <span className="text-xs font-bold text-white">{activeFamilyProfile.name}</span>
              <p className="text-[10px] text-blue-300">
                {activeFamilyProfile.relation} · {activeFamilyProfile.age} yrs · {activeFamilyProfile.bloodGroup}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold border border-blue-500/30">
            Active
          </span>
        </div>

        {/* Profile List */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Switch Profile ({familyProfiles.length})
          </span>

          {familyProfiles.map((p) => {
            const isSelected = p.id === activeFamilyProfile.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setActiveFamilyProfile(p);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-[#181D2A] border-[#222938] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${p.avatarColor}`}>
                    {p.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {p.relation} · {p.age} yrs · Blood: {p.bloodGroup || 'O+'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    p.id !== 'self' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFamilyProfile(p.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Profile Form or Button */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#2C354A] hover:border-blue-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Family Member / Dependent
          </button>
        ) : (
          <form onSubmit={handleCreate} className="bg-[#181D2A] border border-[#252E42] rounded-2xl p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-white">New Dependent Details</h4>

            <div>
              <label className="text-[10px] text-slate-300 block mb-0.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Papa, Grandma, Aarav..."
                className="w-full bg-[#10131B] border border-[#262F44] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-300 block mb-0.5">Relation</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value as any)}
                  className="w-full bg-[#10131B] border border-[#262F44] rounded-lg px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-300 block mb-0.5">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#10131B] border border-[#262F44] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-300 block mb-0.5">Blood</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-[#10131B] border border-[#262F44] rounded-lg px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
