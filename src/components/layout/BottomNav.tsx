import React from 'react';
import { Users, LayoutGrid, BrainCircuit, FileText, Bot, Calendar } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, appointments } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'doctors', label: 'Doctors', icon: <Users className="w-4 h-4" /> },
    { id: 'specialties', label: 'Categories', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'symptom-ai', label: 'AI Triage', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'report-ai', label: 'Lab Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'chat-assistant', label: 'Smart AI', icon: <Bot className="w-4 h-4" /> },
    { 
      id: 'appointments', 
      label: 'Bookings', 
      icon: <Calendar className="w-4 h-4" />,
      badge: appointments.filter(a => a.status === 'confirmed').length
    }
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-[#0F1117]/95 backdrop-blur-xl border-t border-[#1C2130] px-3 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive 
                ? 'text-blue-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isActive ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 scale-105' : ''
            }`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
              {tab.label}
            </span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute top-0.5 right-2 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold shadow-md shadow-blue-500/40 animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
