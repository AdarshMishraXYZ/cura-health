# 🏥 Cura Health — Full-Stack AI Clinical Triage & Healthcare Platform

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple?logo=vite)](https://vitejs.dev/)

> **Cura Health** is a modern full-stack healthcare platform combining **real-time LLM clinical triage**, **concurrency-safe doctor appointment scheduling**, and an interactive **telehealth consultation suite**. Designed with a dual-portal architecture for both patients and clinicians.

---

## 🌟 Key Highlights & Features

### 1. 🤖 AI Clinical Symptom Triage (Google Gemini 2.5 Flash)
- **Natural Language & Voice Input**: Patients describe symptoms in plain conversational language or dictate hands-free via the browser **Web Speech API**.
- **Specialty Extraction & Routing**: Analyzes physiological and anatomical markers to route complaints across **9 medical specialties** (*Orthopedist, Neurologist, Cardiologist, Dermatologist, Gastroenterologist, ENT, Gynecologist, Pediatrician, General Physician*).
- **Structured Clinical Output**: Enforces strict JSON schemas returning urgency levels (`routine`, `moderate`, `high_attention`), confidence match scores (70–99%), clinical reasoning, and evidence-based OTC precautions.
- **Server-Side API Proxy**: Gemini API keys are held securely on the backend server—never exposed to the client—with token-bucket rate limiting and input sanitization against prompt injection.

### 2. 🔒 Concurrency-Safe Appointment Booking (PostgreSQL + Prisma ORM)
- **Race Condition Prevention**: Prevents double-booking collisions using **transaction isolation (`prisma.$transaction`)**. If two patients attempt to book the same slot at the same second, one succeeds and the other receives an instant `409 Conflict`.
- **Digital QR Appointment Passes**: Confirmed bookings generate digital passes with downloadable `.ics` calendar events and unique verification tokens.

### 3. 🩺 Dual-Portal Architecture
- **Patient Experience**: Interactive landing page, specialty discovery, side-by-side doctor comparison, and booking management.
- **Clinician Workstation**: Dedicated doctor perspective with real-time patient queues, symptom summaries, appointment status controls, and downloadable digital prescriptions (`.txt` via HTML5 Blob API).

### 4. 🎥 Telehealth Consultation Suite
- Simulated video consultation room featuring live consultation timers, in-call clinical notes, e-prescription generation, and media sharing.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Frontend (Vite)                        │
│             src/services/apiClient.ts · Tailwind CSS v4                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Node.js + Express + TypeScript Backend                 │
│                                                                        │
│   ├── /api/auth          → JWT Auth & bcrypt password hashing          │
│   ├── /api/doctors       → Filtered directory of 23 specialists        │
│   ├── /api/appointments  → Transaction-safe booking (409 on conflict)   │
│   ├── /api/triage        → Gemini 2.5 Flash Proxy + Rate Limiter       │
│   └── /api/health        → Database health & connection telemetry      │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ Prisma ORM                     │ REST API
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        PostgreSQL 16 Database        │  │     Google Gemini 2.5 Flash  │
│  users · doctors · appointments     │  │   Cloud Clinical Inference   │
│            triage_logs               │  │                              │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (~6.0)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React (`lucide-react`)
- **Animations**: Canvas-Confetti
- **Build Tool**: Vite 8 (Ultra-fast ESM HMR)
- **Linter**: Oxlint (High-performance Rust-based linter)

### **Backend Server**
- **Runtime**: Node.js v24+
- **Framework**: Express 4.21 with TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma ORM 5.22
- **Validation**: Zod
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Authentication**: JWT (`jsonwebtoken`) & Bcrypt (`bcryptjs`)

### **AI & Cloud Services**
- **LLM Engine**: Google Gemini 2.5 Flash (`generativelanguage.googleapis.com`)
- **Speech Engine**: Web Speech API (`webkitSpeechRecognition`)

---

## 📂 Project Structure

```
cura-health/
├── server/                     # Backend Node.js / Express API
│   ├── prisma/
│   │   └── schema.prisma       # Prisma ORM PostgreSQL models
│   ├── src/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── index.ts            # Express server entry point
│   │   ├── seed.ts             # Database seeding (23 doctors, demo users)
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication & RBAC
│   │   │   └── rateLimiter.ts  # Token-bucket rate limiters
│   │   └── routes/
│   │       ├── auth.routes.ts         # User registration & login
│   │       ├── doctors.routes.ts      # Doctor directory endpoints
│   │       ├── appointments.routes.ts # Concurrency-safe booking APIs
│   │       └── triage.routes.ts       # Secure Gemini AI triage proxy
│   ├── .env                    # Backend environment configuration
│   └── package.json
│
├── src/                        # Frontend React 19 SPA
│   ├── components/
│   │   ├── ai/                 # SymptomAnalyzer component
│   │   ├── appointments/       # Booking modals, passes, telehealth room
│   │   ├── common/             # Avatars, specialty icons, modals
│   │   ├── doctors/            # Doctor cards, directory, comparison
│   │   ├── home/               # Clean landing page with role portals
│   │   ├── layout/             # Navbar, BottomNav, MobileFrame
│   │   └── workspace/          # Clinician/Doctor workstation
│   ├── context/
│   │   └── AppContext.tsx      # Global state store
│   ├── services/
│   │   ├── apiClient.ts        # Client connecting to Express backend
│   │   └── geminiAgentService.ts # Fallback offline reasoning engine
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root router component
│   └── main.tsx
│
├── package.json                # Root scripts and frontend dependencies
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+ recommended)
- **PostgreSQL** (v15+ running locally or cloud-hosted via Supabase/Neon)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/AdarshMishraXYZ/cura-health-.git
cd cura-health
```

### 2. Setup the Backend
Navigate to the `server/` directory and configure `.env`:
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cura_health?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
GEMINI_API_KEY="your_gemini_api_key_here"
CORS_ORIGIN="http://localhost:5173"
```

Initialize the database and seed the 23 specialist doctors:
```bash
npx prisma db push
npm run seed
```

### 3. Setup the Frontend
From the root directory:
```bash
npm install
```

---

## 💻 Running the Application

You can run both services simultaneously from separate terminals:

```bash
# Terminal 1: Start Express Backend (Runs on http://localhost:5000)
npm run server

# Terminal 2: Start React Frontend (Runs on http://localhost:5173)
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health` | Database connection & health status | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | **Yes (Bearer)** |
| `GET` | `/api/doctors` | List doctors with optional `?specialty=` filter | No |
| `GET` | `/api/doctors/:id` | Fetch doctor profile with availability | No |
| `POST` | `/api/appointments` | Book appointment (concurrency-safe transaction) | Optional |
| `GET` | `/api/appointments` | List all appointments | Optional |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel an appointment | Optional |
| `POST` | `/api/triage` | Secure Gemini 2.5 Flash symptom triage proxy | No (Rate-limited) |

---

## 🔒 Security & Concurrency Design (Interview Talking Points)

1. **Double-Booking Atomicity**:
   Slot validation and record creation occur inside an isolated database transaction. If two parallel requests target the same slot, the second request triggers a `SLOT_ALREADY_BOOKED` rollback, returning an explicit `409 Conflict`.
2. **LLM Key Protection**:
   The frontend never handles API keys in production. All inference requests are routed through `/api/triage`, where an IP rate limiter guards against quota abuse and input length caps prevent prompt injection.
3. **Audit Trail**:
   Every triage decision and matched specialty is recorded in the PostgreSQL `triage_logs` table for clinical analytics and audit compliance.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
