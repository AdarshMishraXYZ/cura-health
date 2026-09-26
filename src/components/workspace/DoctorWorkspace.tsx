import React, { useState } from 'react';
import { UserCheck, FileText, CheckCircle2, Stethoscope, Clock, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PatientQueueItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  slotTime: string;
  complaint: string;
  triagePriority: 'High' | 'Routine' | 'Moderate';
  status: 'Waiting' | 'In Consultation' | 'Completed';
  aiBrief: string;
}

const SAMPLE_QUEUE: PatientQueueItem[] = [
  {
    id: 'pq-1',
    name: 'Alex Mercer',
    age: 28,
    gender: 'Male',
    slotTime: '09:30 AM',
    complaint: 'Sore throat and mild fever for 2 days',
    triagePriority: 'Moderate',
    status: 'In Consultation',
    aiBrief: 'Possible acute pharyngitis. Temp 100.2°F. Denies breathing difficulty. Recommends throat swab and antipyretics.'
  },
  {
    id: 'pq-2',
    name: 'Sarah Jenkins',
    age: 34,
    gender: 'Female',
    slotTime: '10:00 AM',
    complaint: 'Sub-optimal Vitamin D (18 ng/mL) follow-up review',
    triagePriority: 'Routine',
    status: 'Waiting',
    aiBrief: 'Routine lab review. Serum 25-OH Vit D low. Suggest weekly 60,000 IU cholecalciferol course for 8 weeks.'
  },
  {
    id: 'pq-3',
    name: 'Marcus Brody',
    age: 49,
    gender: 'Male',
    slotTime: '10:30 AM',
    complaint: 'Chest tightness after exertion + elevated LDL (162 mg/dL)',
    triagePriority: 'High',
    status: 'Waiting',
    aiBrief: 'Cardiovascular risk. Atherogenic dyslipidemia with exertion-related chest pressure. Needs urgent resting ECG.'
  }
];

export const DoctorWorkspace: React.FC = () => {
  const { setActiveTab } = useApp();
  const [queue, setQueue] = useState<PatientQueueItem[]>(SAMPLE_QUEUE);
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueItem>(SAMPLE_QUEUE[0]);
  const [activeTab, setWorkspaceTab] = useState<'queue' | 'prescription'>('queue');

  // Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Viral Pharyngitis with mild pyrexia');
  const [rxMeds, setRxMeds] = useState([
    { name: 'Paracetamol', dose: '650 mg', freq: 'TDS (Every 8h)', duration: '3 days' },
    { name: 'Warm Salt Water Gargle', dose: '1 Glass', freq: 'QDS (4 times/day)', duration: '5 days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [isRxSigned, setIsRxSigned] = useState(false);

  const addMedRow = () => {
    if (!newMedName) return;
    setRxMeds([...rxMeds, { name: newMedName, dose: newMedDose || '1 Tab', freq: 'BD', duration: '5 days' }]);
    setNewMedName('');
    setNewMedDose('');
  };

  const handleSignRx = () => {
    setIsRxSigned(true);
    // Mark patient as completed in queue
    setQueue(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, status: 'Completed' } : p));
  };

  const downloadRxPdf = () => {
    const content = `
========================================
       CURA HEALTH CLINICAL NETWORK
   E-PRESCRIPTION & CLINICAL SUMMARY
========================================
Doctor: Dr. Richard James, MD (Internal Medicine)
License: #MED-NY-849204 | Apex Health Center
Date: 2026-09-26
----------------------------------------
Patient: ${selectedPatient.name}
Age / Sex: ${selectedPatient.age} yrs / ${selectedPatient.gender}
Chief Complaint: ${selectedPatient.complaint}
----------------------------------------
Diagnosis:
${rxDiagnosis}

Prescribed Medications & Regimen:
${rxMeds.map((m, i) => `${i + 1}. ${m.name} - ${m.dose} | Frequency: ${m.freq} | Duration: ${m.duration}`).join('\n')}

Clinical Instructions:
- Hydrate well with oral fluids (>2.5L/day)
- Rest for 48 hours. Report to ER if temperature > 103°F or breathing difficulty occurs.
----------------------------------------
Digitally Signed by: Dr. Richard James (Verified Cryptographic Token: #CURA-RX-RJ9942)
========================================
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${selectedPatient.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Clinician Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            Clinician Workstation
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dr. Richard James, MD</h2>
          <p className="text-xs text-slate-400">Apex Medical Center · Daily Outpatient Queue</p>
        </div>
        <button
          onClick={() => setActiveTab('doctors')}
          className="text-xs text-blue-400 hover:text-white px-3 py-1.5 bg-[#141721] rounded-xl border border-[#202534] font-medium"
        >
          Exit to Patient View
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#141721] border border-[#202534] p-1 rounded-xl gap-1">
        <button
          onClick={() => setWorkspaceTab('queue')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Today's Queue ({queue.length})
        </button>
        <button
          onClick={() => setWorkspaceTab('prescription')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'prescription'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Digital Prescription Pad
        </button>
      </div>

      {/* View 1: Patient Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Waiting Room & Active Consultations
          </span>

          {queue.map((patient) => {
            const isSelected = patient.id === selectedPatient.id;
            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-[#141721] border-[#202534] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{patient.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {patient.age}y · {patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        patient.triagePriority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : patient.triagePriority === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {patient.triagePriority} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300">
                      {patient.slotTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 mb-2 font-medium">
                  <strong>Complaint:</strong> {patient.complaint}
                </p>

                {/* AI Pre-Triage Brief */}
                <div className="bg-[#0F1117] border border-white/5 rounded-xl p-2.5 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-300 leading-snug">
                    <strong className="text-blue-300">AI Clinical Triage: </strong>
                    {patient.aiBrief}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#202534]">
                  <span className={`text-[10px] font-bold ${
                    patient.status === 'In Consultation' ? 'text-emerald-400 flex items-center gap-1' : 'text-slate-400'
                  }`}>
                    {patient.status === 'In Consultation' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    Status: {patient.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatient(patient);
                      setWorkspaceTab('prescription');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Prescribe Rx →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Prescription Pad */}
      {activeTab === 'prescription' && (
        <div className="bg-[#141721] border border-[#202534] rounded-2xl p-4 shadow-xl space-y-3.5">
          {/* Patient Card */}
          <div className="p-3 rounded-xl bg-[#181D2A] border border-[#242C3F] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white">Patient: {selectedPatient.name}</span>
              <p className="text-[10px] text-slate-400">
                {selectedPatient.age} yrs · {selectedPatient.gender} · Slot: {selectedPatient.slotTime}
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-300 font-semibold">
              Active Case
            </span>
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Physician Diagnosis & ICD-11 Note
            </label>
            <input
              type="text"
              value={rxDiagnosis}
              onChange={(e) => setRxDiagnosis(e.target.value)}
              className="w-full bg-[#181D2A] border border-[#283247] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Medication Rows */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Prescribed Medications
            </label>
            <div className="space-y-1.5 mb-2">
              {rxMeds.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0F1117] border border-[#1E2436] text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{med.name}</span>
                    <span className="text-slate-400 ml-1">({med.dose})</span>
                  </div>
                  <span className="text-[11px] text-blue-400">{med.freq} · {med.duration}</span>
                </div>
              ))}
            </div>

            {/* Quick add med row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Drug name..."
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="flex-1 bg-[#181D2A] border border-[#283247] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Dose..."
                value={newMedDose}
                onChange={(e) => setNewMedDose(e.target.value)}
                className="w-20 bg-[#181D2A] border border-[#283247] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addMedRow}
                className="px-3 py-1.5 bg-[#1F273B] hover:bg-[#28334E] text-white rounded-xl text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Sign & Issue CTA */}
          <div className="pt-2 border-t border-[#202534] space-y-2">
            {!isRxSigned ? (
              <button
                onClick={handleSignRx}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sign & Authorize Digital e-Prescription
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    e-Prescription Signed (Token: #CURA-RX-RJ9942)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
                    Vault Synchronized
                  </span>
                </div>
                <button
                  onClick={downloadRxPdf}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Official Rx Document (.txt)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
