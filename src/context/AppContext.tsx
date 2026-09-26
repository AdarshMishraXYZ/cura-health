import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, SpecialtyId, Appointment, MedicalReport } from '../types';
import { SAMPLE_REPORTS } from '../data/sampleReports';

export type ActiveTab = 
  | 'doctors'
  | 'specialties'
  | 'symptom-ai'
  | 'report-ai'
  | 'chat-assistant'
  | 'appointments'
  | 'medication-tracker'
  | 'body-map'
  | 'drug-checker'
  | 'health-trends'
  | 'doctor-comparison'
  | 'clinician-view'
  | 'family-profiles';

// ─── Family Profile ──────────────────────────────────────────────────────────
export interface FamilyProfile {
  id: string;
  name: string;
  relation: 'Self' | 'Spouse' | 'Child' | 'Parent' | 'Other';
  age: number;
  bloodGroup?: string;
  avatarInitials: string;
  avatarColor: string;
}

const DEFAULT_PROFILES: FamilyProfile[] = [
  { id: 'self', name: 'You (Primary)', relation: 'Self', age: 28, bloodGroup: 'O+', avatarInitials: 'ME', avatarColor: 'bg-blue-600' },
  { id: 'parent-1', name: 'Dad', relation: 'Parent', age: 58, bloodGroup: 'A+', avatarInitials: 'DA', avatarColor: 'bg-emerald-600' },
  { id: 'child-1', name: 'Ananya', relation: 'Child', age: 7, bloodGroup: 'B+', avatarInitials: 'AN', avatarColor: 'bg-pink-500' },
];

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
  savedReports: MedicalReport[];
  addReport: (report: MedicalReport) => void;
  activeVideoCall: Appointment | null;
  setActiveVideoCall: (apt: Appointment | null) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  navigateToSpecialty: (specialtyId: SpecialtyId) => void;
  // Family profiles
  familyProfiles: FamilyProfile[];
  activeFamilyProfile: FamilyProfile;
  setActiveFamilyProfile: (profile: FamilyProfile) => void;
  addFamilyProfile: (profile: Omit<FamilyProfile, 'id'>) => void;
  removeFamilyProfile: (id: string) => void;
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

  // ── Persisted state ────────────────────────────────────────────────────────
  const [savedReports, setSavedReports] = useState<MedicalReport[]>(() =>
    loadFromStorage('cura_reports', SAMPLE_REPORTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('cura_appointments', DEFAULT_APPOINTMENTS)
  );

  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>(() =>
    loadFromStorage('cura_family_profiles', DEFAULT_PROFILES)
  );

  const [activeFamilyProfile, setActiveFamilyProfileState] = useState<FamilyProfile>(() => {
    const profiles = loadFromStorage('cura_family_profiles', DEFAULT_PROFILES);
    const activeId = loadFromStorage<string>('cura_active_profile_id', 'self');
    return profiles.find(p => p.id === activeId) ?? profiles[0];
  });

  // ── Sync to localStorage ───────────────────────────────────────────────────
  useEffect(() => { saveToStorage('cura_appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('cura_reports', savedReports); }, [savedReports]);
  useEffect(() => { saveToStorage('cura_family_profiles', familyProfiles); }, [familyProfiles]);
  useEffect(() => { saveToStorage('cura_active_profile_id', activeFamilyProfile.id); }, [activeFamilyProfile]);

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

  const addReport = (report: MedicalReport) => {
    setSavedReports(prev => [report, ...prev]);
  };

  const navigateToSpecialty = (specialtyId: SpecialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setActiveTab('doctors');
  };

  const setActiveFamilyProfile = (profile: FamilyProfile) => {
    setActiveFamilyProfileState(profile);
  };

  const addFamilyProfile = (profileData: Omit<FamilyProfile, 'id'>) => {
    const newProfile: FamilyProfile = {
      ...profileData,
      id: `profile-${Date.now()}`
    };
    setFamilyProfiles(prev => [...prev, newProfile]);
  };

  const removeFamilyProfile = (id: string) => {
    if (id === 'self') return; // Can't remove primary
    setFamilyProfiles(prev => prev.filter(p => p.id !== id));
    if (activeFamilyProfile.id === id) {
      const remaining = familyProfiles.filter(p => p.id !== id);
      if (remaining.length > 0) setActiveFamilyProfileState(remaining[0]);
    }
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
        savedReports,
        addReport,
        activeVideoCall,
        setActiveVideoCall,
        isMobilePreview,
        setIsMobilePreview,
        navigateToSpecialty,
        familyProfiles,
        activeFamilyProfile,
        setActiveFamilyProfile,
        addFamilyProfile,
        removeFamilyProfile,
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
