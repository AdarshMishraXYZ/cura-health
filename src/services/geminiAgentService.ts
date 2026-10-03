import { Doctor, MedicineSuggestion, SpecialtyId, SymptomAnalysisResult, ChatMessage } from '../types';
import { DOCTORS } from '../data/doctors';

const STORAGE_KEY = 'cura_gemini_api_key';

// Check environment variable or localStorage
export function getGeminiApiKey(): string {
  try {
    const fromEnv = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 10) {
      return fromEnv.trim();
    }
  } catch { /* ignore */ }

  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage && fromStorage.trim().length > 10) {
      return fromStorage.trim();
    }
  } catch { /* ignore */ }

  return '';
}

export function setGeminiApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch { /* ignore */ }
}

export function isLiveLLMEnabled(): boolean {
  return getGeminiApiKey().length > 10;
}

// ─── AGENT SYSTEM PROMPT ───────────────────────────────────────────────────────
const MEDICAL_AGENT_SYSTEM_PROMPT = `
You are the "Cura Clinical AI Orchestrator", an intelligent multi-agent healthcare assistant.
You possess deep medical clinical reasoning capabilities, empathy, and conversational fluency.

Your job is to analyze user queries and respond in structured JSON format.

ROLES & MODES YOU OPERATE IN:
1. GREETING / CASUAL CHAT ("hi", "hello", "how are you", "who are you"):
   - Respond naturally, warmly, empathetically, and conversationally like a compassionate healthcare professional.
   - Do NOT treat greetings as disease names. Never say "I am here to help with hiii".
   - Ask how they are feeling today.

2. SYMPTOM TRIAGE (e.g., "difficulty walking, foot hurt, hand not moving", "severe headache", "acid reflux"):
   - Reason through anatomy, physiology, and pathology.
   - Accurately determine the best medical specialty: 'orthopedist' (bones, joints, walking, feet, hands, spine, movement), 'neurologist' (brain, nerves, migraines, seizures), 'cardiologist' (chest, heart, palpitations, BP), 'dermatologist' (skin, rash, acne), 'gastroenterologist' (stomach, gut, reflux), 'ent' (ear, nose, throat), 'gynecologist' (women reproductive), 'pediatrician' (children), or 'general' (systemic/fever).
   - Rate clinical match score (60 - 99).
   - Assign urgency: 'routine', 'moderate', or 'high_attention'.
   - Provide medical reasoning and 3 evidence-based actionable next steps.
   - Recommend 2-3 safe Over-The-Counter (OTC) medicines or home remedies with dosages and precautions.
   - State whether a doctor consultation is recommended.

3. MEDICATION SAFETY & DRUG INTERACTIONS:
   - Provide accurate therapeutic dosages, liver/kidney cautions, and max daily limits (e.g. Paracetamol 3,000mg/day).
   - Advise on food timings, contraindications, and potential side effects.

JSON OUTPUT FORMAT SCHEMA (Strictly return ONLY raw JSON, no markdown backticks, no extra text):
{
  "intent": "greeting" | "casual_chat" | "symptom_triage" | "medication_safety" | "general_health",
  "conversationalText": "Your natural language response to the user. Use emojis and markdown formatting appropriately.",
  "suggestedSpecialtyId": "orthopedist" | "neurologist" | "cardiologist" | "dermatologist" | "gastroenterologist" | "ent" | "gynecologist" | "pediatrician" | "general",
  "suggestedSpecialtyName": "string",
  "matchScore": number (70-99),
  "urgencyLevel": "routine" | "moderate" | "high_attention",
  "clinicalReasoning": "string",
  "recommendations": ["step 1", "step 2", "step 3"],
  "recommendedMedicines": [
    {
      "name": "string",
      "type": "otc" | "supplement" | "home_remedy",
      "dosage": "string",
      "indication": "string",
      "precautions": "string"
    }
  ],
  "shouldBookAppointment": boolean,
  "bookingPrompt": "string",
  "quickReplyOptions": ["option 1", "option 2", "option 3"]
}
`;

// Helper: Make real REST call to Gemini 1.5 Flash
async function callGeminiRaw(userPrompt: string, apiKey: string): Promise<any> {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${MEDICAL_AGENT_SYSTEM_PROMPT}\n\nUSER MESSAGE:\n${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Empty response received from Gemini model.');
  }

  // Parse JSON
  const cleaned = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── SAFE NO-KEY FALLBACK ──────────────────────────────────────────────────────
// When no Gemini API key is configured, we ONLY handle greetings safely.
// For ANY medical/symptom/drug query, we refuse to fabricate advice.
// Fabricating dosages or diagnoses without real LLM reasoning is dangerous.
function localAgenticClinicalReasoning(text: string): any {
  const lower = text.toLowerCase().trim();

  const isGreeting = /^(h+i+|h+e+y+|h+e+l+l+o+|h+o+l+a+|howdy|sup|yo|greetings)\b/i.test(lower);
  const isHowAreYou = lower.includes('how are you') || lower.includes('how r u') || lower.includes('whats up') || lower.includes("what's up");
  const isIdentity = lower.includes('who are you') || lower.includes('what can you do') || lower.includes('what are you');

  if (isHowAreYou) {
    return {
      intent: 'casual_chat',
      conversationalText: "I'm doing great, thank you for asking! 😊\n\nTo give you **safe, accurate symptom analysis and medical guidance**, I need my Gemini AI engine active.\n\n👉 Tap the **⚡ AI Engine** button in the top bar to add your free Gemini API key — takes just 30 seconds!",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 90,
      urgencyLevel: 'routine',
      clinicalReasoning: '',
      recommendations: [],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: ['How do I get a Gemini API key?', 'Browse doctors', 'What can you help me with?']
    };
  }

  if (isIdentity) {
    return {
      intent: 'casual_chat',
      conversationalText: "I am **Cura Health AI** — powered by Google Gemini! 🩺\n\nI can:\n• **Analyze your symptoms** and route you to the right specialist\n• **Check drug safety** and OTC medicine dosages\n• **Read your lab reports** and explain biomarkers\n• **Book appointments** with doctors\n\n⚡ **Add your free Gemini API key** (tap the AI Engine button in the top bar) to unlock all AI capabilities.",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 95,
      urgencyLevel: 'routine',
      clinicalReasoning: '',
      recommendations: [],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: ['How to get API key?', 'Browse doctors', 'Book an appointment']
    };
  }

  if (isGreeting && lower.length < 35) {
    return {
      intent: 'greeting',
      conversationalText: "Hello! 👋 Welcome to **Cura Health AI**!\n\nI'm your intelligent clinical assistant. To give you **safe, accurate medical analysis** I need my AI engine configured.\n\n👉 Tap **⚡ AI Engine** in the top bar → paste your free **Gemini API key** from [aistudio.google.com](https://aistudio.google.com/app/apikey) → I'll be fully operational in seconds!",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 90,
      urgencyLevel: 'routine',
      clinicalReasoning: '',
      recommendations: [],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: [
        'How do I get a free Gemini API key?',
        'Browse available doctors',
        'Book an appointment'
      ]
    };
  }

  // ── Any medical/symptom/drug query without an API key ───────────────────────
  // We DO NOT fabricate dosages, diagnoses, or specialist routing without LLM.
  // Returning fake medical advice without real reasoning is dangerous.
  return {
    intent: 'no_api_key',
    conversationalText: "⚠️ **AI Engine Not Configured**\n\nTo safely analyze your symptoms, suggest medicines, or provide clinical guidance — I need my **Gemini AI engine** to be active.\n\nWithout real AI reasoning, fabricating medical advice would be dangerous to your health.\n\n**Activate in 30 seconds:**\n1. Tap the **⚡ AI Engine** button in the top bar\n2. Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)\n3. Paste the key and save\n\nOnce active, I can accurately analyze any symptom and give evidence-based guidance. 🩺",
    suggestedSpecialtyId: 'general',
    suggestedSpecialtyName: 'General physician',
    matchScore: 0,
    urgencyLevel: 'routine',
    clinicalReasoning: 'Gemini API key required for safe clinical reasoning.',
    recommendations: [
      'Configure your Gemini API key to enable AI-powered medical analysis.',
      'You can still browse doctors and book appointments without an API key.',
      'For urgent symptoms, please consult a healthcare professional directly.'
    ],
    recommendedMedicines: [],
    shouldBookAppointment: false,
    bookingPrompt: '',
    quickReplyOptions: [
      'How to get free Gemini API key?',
      'Browse doctors anyway',
      'Book an appointment'
    ]
  };
}

// ─── PUBLIC AGENTIC TRIAGE API ────────────────────────────────────────────────
export async function analyzeSymptomsWithLLMAgent(symptomsText: string): Promise<SymptomAnalysisResult> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const llmResult = await callGeminiRaw(`Please analyze these patient symptoms:\n"${symptomsText}"`, apiKey);
      return {
        symptoms: symptomsText,
        suggestedSpecialtyId: (llmResult.suggestedSpecialtyId || 'general') as SpecialtyId,
        suggestedSpecialtyName: llmResult.suggestedSpecialtyName || 'General physician',
        matchScore: llmResult.matchScore || 96,
        urgencyLevel: llmResult.urgencyLevel || 'routine',
        reasoning: llmResult.clinicalReasoning || llmResult.conversationalText || 'Clinical reasoning completed.',
        recommendations: llmResult.recommendations || ['Consult a physician', 'Stay hydrated'],
        disclaimer: 'Clinical AI triage inference — not a definitive medical diagnosis.'
      };
    } catch (err) {
      console.warn('Live Gemini API call encountered an issue:', err);
    }
  }

  // Safe fallback — only returns API-key prompt, no fabricated medical data
  await new Promise(r => setTimeout(r, 400));
  const result = localAgenticClinicalReasoning(symptomsText);
  return {
    symptoms: symptomsText,
    suggestedSpecialtyId: result.suggestedSpecialtyId,
    suggestedSpecialtyName: result.suggestedSpecialtyName,
    matchScore: result.matchScore,
    urgencyLevel: result.urgencyLevel,
    reasoning: result.clinicalReasoning || result.conversationalText,
    recommendations: result.recommendations,
    disclaimer: result.matchScore === 0
      ? 'Add your Gemini API key to enable real AI-powered triage.'
      : 'Clinical AI triage inference — not a definitive medical diagnosis.'
  };
}

// ─── PUBLIC AGENTIC CHAT API ──────────────────────────────────────────────────
export async function runAgenticChat(userText: string, chatHistory: ChatMessage[]): Promise<ChatMessage[]> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const historyContext = chatHistory.slice(-4).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const fullPrompt = `CHAT CONTEXT:\n${historyContext}\n\nCURRENT USER MESSAGE:\n"${userText}"`;
      const llmResult = await callGeminiRaw(fullPrompt, apiKey);

      const doctor = DOCTORS.find(d => d.specialtyId === llmResult.suggestedSpecialtyId) || DOCTORS[0];

      return [
        {
          id: `m-llm-${Date.now()}`,
          sender: 'assistant',
          text: llmResult.conversationalText,
          timestamp: 'Just now',
          medicines: llmResult.recommendedMedicines,
          options: llmResult.quickReplyOptions,
          shouldAskBooking: llmResult.shouldBookAppointment,
          actions: llmResult.shouldBookAppointment
            ? [
                {
                  id: 'act-book-doc',
                  label: `Book ${llmResult.suggestedSpecialtyName || 'Doctor'} (${doctor.name})`,
                  variant: 'primary',
                  actionType: 'propose_booking',
                  payload: { doctor }
                }
              ]
            : undefined
        }
      ];
    } catch (err) {
      console.warn('Gemini Live API error:', err);
    }
  }

  // Safe fallback — no fabricated medical advice
  await new Promise(r => setTimeout(r, 450));
  const res = localAgenticClinicalReasoning(userText);
  const doctor = DOCTORS.find(d => d.specialtyId === res.suggestedSpecialtyId) || DOCTORS[0];

  return [
    {
      id: `m-agent-${Date.now()}`,
      sender: 'assistant',
      text: res.conversationalText,
      timestamp: 'Just now',
      medicines: res.recommendedMedicines,
      options: res.quickReplyOptions,
      shouldAskBooking: res.shouldBookAppointment,
      actions: res.shouldBookAppointment
        ? [
            {
              id: 'act-book-doc',
              label: `Book ${res.suggestedSpecialtyName} (${doctor.name})`,
              variant: 'primary',
              actionType: 'propose_booking',
              payload: { doctor }
            }
          ]
        : undefined
    }
  ];
}
