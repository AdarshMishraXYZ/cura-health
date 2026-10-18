# 🏥 AI-Powered Clinical Triage & Smart Healthcare Scheduling

- **AI Clinical Triage:** Integrated Google Gemini 2.5 Flash with React and Express for natural-language symptom analysis, nine-specialty classification, and structured JSON responses.

- **Concurrency-Safe Scheduling:** Used PostgreSQL transactions, Prisma ORM, and database constraints to prevent double booking and handle scheduling conflicts with HTTP 409 responses.

- **Dual-Portal Workflow:** Developed separate patient and clinician portals for appointment booking, digital pass generation, live queues, and prescription management.

- **Telehealth Consultation Suite:** Built a video consultation simulation with in-call timers, digital prescriptions, and clinical notes.

- **Secure Backend Architecture:** Implemented server-side AI API proxying, authentication, token-bucket rate limiting, and clinical audit trails.

- **Full-Stack Technology:** Built using React 19, TypeScript, Node.js, Express, PostgreSQL 16, Prisma ORM, Tailwind CSS v4, and Vite 8.

## ✨ Key Features

### 🤖 1. AI Clinical Triage

- **Natural Language Input:** Patients can describe their symptoms using text or supported browser speech recognition through the Web Speech API.
- **Nine-Specialty Reasoning:** Organizes symptom information into relevant clinical specialties to support preliminary triage.
- **Structured JSON Responses:** Converts AI-generated results into predictable, application-friendly data structures.
- **Secure API Proxy:** Routes Gemini requests through the Express backend to protect the API key.
- **Actionable Triage Results:** Presents structured symptom summaries and suggested next steps for clinician review.

### 📅 2. Concurrency-Safe Appointment Scheduling

- **Atomic Database Operations:** Uses Prisma transactions to keep related scheduling operations consistent.
- **Race Condition Protection:** Prevents concurrent booking requests from successfully claiming the same appointment slot when the database constraints and transaction logic are configured appropriately.
- **Conflict Resolution:** Returns HTTP `409 Conflict` when a requested slot is no longer available.
- **Database Integrity:** Uses appropriate constraints and transaction isolation to protect appointment data.
- **Consistent Booking State:** Ensures that failed booking attempts do not leave partially completed scheduling operations.

### 👥 3. Dual-Portal Workflow

**Patient Portal**
- Browse available doctors and specialties.
- Book appointments.
- View appointment details and booking status.
- Access digital appointment passes.

**Clinician Portal**
- View appointment queues.
- Review patient booking information.
- Manage consultation workflows.
- Create and issue digital prescriptions.
- Maintain clinical notes and relevant audit records.

### 🎥 4. Telehealth Consultation Suite

- Simulated video consultation interface.
- In-call timer and consultation status.
- Digital prescription pad.
- Clinical notes workspace.
- Integrated patient and clinician workflow.

> The video consultation interface is a simulation unless a real-time communication provider has been integrated.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based frontend |
| TypeScript | Type safety across the application |
| Vite 8 | Frontend development and build tooling |
| Tailwind CSS v4 | Utility-first styling |
| Node.js | Backend JavaScript runtime |
| Express | REST API and middleware |
| PostgreSQL 16 | Relational database |
| Prisma ORM | Database access and schema management |
| Google Gemini 2.5 Flash | AI-powered clinical triage |
| Web Speech API | Browser-based speech input, where supported |

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────┐
│              React Frontend                │
│                                            │
│  Patient Portal  │  Clinician Workstation  │
│  AI Triage       │  Appointments           │
│  Booking         │  Prescriptions          │
│  Telehealth UI   │  Clinical Notes         │
└──────────────────────┬─────────────────────┘
                       │
                       │ HTTPS / REST API
                       ▼
┌────────────────────────────────────────────┐
│            Express API Gateway             │
│                                            │
│  Authentication & Authorization            │
│  Request Validation & Rate Limiting        │
│  Appointment & Doctor Services             │
│  AI Triage Proxy                           │
│  Error Handling & Audit Logging            │
└──────────────┬─────────────────┬───────────┘
               │                 │
               ▼                 ▼
┌──────────────────────┐  ┌──────────────────┐
│   PostgreSQL 16      │  │ Google Gemini    │
│                      │  │ 2.5 Flash API    │
│ Patients & Users     │  │                  │
│ Doctors              │  │ Clinical triage  │
│ Appointments         │  │ JSON generation  │
│ Prescriptions        │  └──────────────────┘
│ Audit Records        │
└──────────────────────┘
```

### Request Lifecycle

1. The React application collects user input.
2. The frontend sends a request to the Express REST API.
3. Express validates the request and checks authentication and authorization where required.
4. Business logic processes the request.
5. Prisma communicates with PostgreSQL for persistent data operations.
6. For triage requests, the backend calls Gemini using a server-side API key.
7. The API returns a structured response to the frontend.

---

## 📂 Project Structure

The following is a reference directory structure. Adjust file names to match the actual repository.

```text
healthcare-platform/
│
├── public/
│   └── assets/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── pages/
│   │   ├── patient/
│   │   ├── clinician/
│   │   ├── appointments/
│   │   └── triage/
│   │
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── doctors.routes.ts
│   │   │   ├── appointments.routes.ts
│   │   │   └── triage.routes.ts
│   │   │
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install the following before starting:

- Node.js version compatible with your project dependencies.
- npm.
- PostgreSQL 16.
- A Google AI Studio API key for Gemini 2.5 Flash.
- Git.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd healthcare-platform
```

Replace `<YOUR_REPOSITORY_URL>` with your repository URL.

### 2. Install Dependencies

If the root `package.json` manages the frontend:

```bash
npm install
```

Install backend dependencies separately if `server/` has its own `package.json`:

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Create the environment files from the provided examples.

```bash
cp .env.example .env
cp server/.env.example server/.env
```

On Windows, create or copy these files manually if `cp` is unavailable.

**Frontend `.env`**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend `server/.env`**

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthcare_db?schema=public"
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=replace_with_a_long_random_secret
```

