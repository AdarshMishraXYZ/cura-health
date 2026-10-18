// API Client for Cura Health Backend Server

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cura_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Doctors
  getDoctors: async (params?: { specialty?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/doctors${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch doctors from server');
    return res.json();
  },

  getDoctorById: async (id: string) => {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    if (!res.ok) throw new Error('Doctor not found');
    return res.json();
  },

  // Appointments
  createAppointment: async (payload: {
    doctorId: string;
    date: string;
    timeSlot: string;
    patientName: string;
    patientAge?: number;
    patientGender?: string;
    contactPhone?: string;
    symptomsNote: string;
    consultationType?: 'video' | 'in-person';
    clinicalUrgency?: 'routine' | 'moderate' | 'high_attention';
  }) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to book appointment');
    }
    return data;
  },

  getAppointments: async () => {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to retrieve appointments');
    return res.json();
  },

  cancelAppointment: async (id: string) => {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // AI Triage Proxy (Secure server-side LLM call)
  analyzeSymptoms: async (symptoms: string) => {
    const res = await fetch(`${API_BASE}/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'AI triage service encountered an error');
    }
    return data.result;
  },

  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      localStorage.setItem('cura_auth_token', data.token);
      localStorage.setItem('cura_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('cura_auth_token');
    localStorage.removeItem('cura_user');
  },
};
