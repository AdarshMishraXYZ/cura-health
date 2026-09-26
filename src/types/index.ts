export type SpecialtyId = 
  | 'general'
  | 'neurologist'
  | 'gynecologist'
  | 'cardiologist'
  | 'pediatrician'
  | 'dermatologist'
  | 'orthopedist'
  | 'ent'
  | 'gastroenterologist'
  | 'psychiatrist';

export interface Specialty {
  id: SpecialtyId;
  name: string;
  iconName: string;
  doctorCount: number;
  description: string;
  commonSymptoms: string[];
}

export interface Doctor {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  specialtyId: SpecialtyId;
  specialtyName: string;
  qualifications: string;
  education?: string;
  experienceYears: number;
  patientsTreated?: number;
  subSpecialties?: string[];
  rating: number;
  reviewCount: number;
  status: 'available' | 'busy' | 'away';
  statusLabel?: string;
  consultationFee: number;
  about: string;
  hospital: string;
  address?: string;
  languages: string[];
  availableDates: {
    dateStr: string; // e.g. "Sat 26"
    fullDate: string; // e.g. "2026-09-26"
    slots: string[]; // e.g. ["10:00", "10:30", "11:00", "11:30"]
  }[];
}

export type ConsultationType = 'in-person' | 'video' | 'audio';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorInitials: string;
  doctorAvatar?: string;
  dateStr: string;
  slotTime: string;
  consultationFee: number;
  type: ConsultationType;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptomsNote: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  qrCodeToken: string;
}

export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  referenceRange: string;
  insight: string;
}

export interface MedicalReport {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  category: string;
  overallSummary: string;
  biomarkers: Biomarker[];
  aiRecommendation: string;
  recommendedSpecialty: SpecialtyId;
}

export interface SymptomAnalysisResult {
  symptoms: string;
  suggestedSpecialtyId: SpecialtyId;
  suggestedSpecialtyName: string;
  matchScore: number; // 0 - 100
  urgencyLevel: 'routine' | 'moderate' | 'high_attention';
  reasoning: string;
  recommendations: string[];
  disclaimer: string;
}

export interface MedicineSuggestion {
  name: string;
  type: 'otc' | 'supplement' | 'home_remedy';
  dosage: string;
  indication: string;
  precautions: string;
}

export interface ChatAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  actionType: 'propose_booking' | 'show_doctors' | 'view_remedies' | 'custom_prompt';
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  medicines?: MedicineSuggestion[];
  proposedDoctor?: Doctor;
  proposedSlot?: {
    date: string;
    time: string;
    fee: number;
  };
  actions?: ChatAction[];
  options?: string[];
  severity?: 'mild' | 'moderate' | 'high';
  shouldAskBooking?: boolean;
}
