import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, SpecialtyId, Appointment } from '../types';

export type ActiveTab = 
  | 'doctors'
  | 'specialties'
  | 'symptom-ai'
  | 'appointments'
  | 'clinician-view';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// ─── Context type ─────────────────────────────────────────────────────────────
interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSpecialtyId: SpecialtyId | null;
  setSelectedSpecialtyId: (id: SpecialtyId | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  bookingDoctor: Doctor | null;
  setBookingDoctor: (doctor: Doctor | null) => void;
  preselectedDate: string;
  setPreselectedDate: (date: string) => void;
  preselectedSlot: string;
  setPreselectedSlot: (slot: string) => void;
  appointments: Appointment[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'qrCodeToken'>) => Appointment;
  cancelAppointment: (id: string) => void;
  activeVideoCall: Appointment | null;
  setActiveVideoCall: (apt: Appointment | null) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  navigateToSpecialty: (specialtyId: SpecialtyId) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Default appointment ──────────────────────────────────────────────────────
const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-8821',
    doctorId: 'doc-1',
    doctorName: 'Dr. Richard James',
    doctorSpecialty: 'General physician',
    doctorInitials: 'RJ',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    dateStr: 'Sun 27',
    slotTime: '09:30 AM',
    consultationFee: 40,
    type: 'video',
    patientName: 'Alex Mercer',
    patientEmail: 'alex.mercer@example.com',
    patientPhone: '+1 (555) 349-2180',
    symptomsNote: 'Sore throat and mild fever since yesterday',
    status: 'confirmed',
    createdAt: '2026-09-26',
    qrCodeToken: 'CURA-8821-RJ-SUN27'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('doctors');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<SpecialtyId | null>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<string>('Sat 26');
  const [preselectedSlot, setPreselectedSlot] = useState<string>('10:00');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(true);
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('cura_appointments', DEFAULT_APPOINTMENTS)
  );

  // ── Sync to localStorage ───────────────────────────────────────────────────
  useEffect(() => { saveToStorage('cura_appointments', appointments); }, [appointments]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const createAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'qrCodeToken'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      qrCodeToken: `CURA-${Math.floor(1000 + Math.random() * 9000)}-${aptData.doctorInitials}`
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const navigateToSpecialty = (specialtyId: SpecialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setActiveTab('doctors');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedSpecialtyId,
        setSelectedSpecialtyId,
        searchQuery,
        setSearchQuery,
        selectedDoctor,
        setSelectedDoctor,
        bookingDoctor,
        setBookingDoctor,
        preselectedDate,
        setPreselectedDate,
        preselectedSlot,
        setPreselectedSlot,
        appointments,
        createAppointment,
        cancelAppointment,
        activeVideoCall,
        setActiveVideoCall,
        isMobilePreview,
        setIsMobilePreview,
        navigateToSpecialty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
