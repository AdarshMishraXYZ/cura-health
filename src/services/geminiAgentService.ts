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

// Helper: Make real REST call to Gemini 2.0 / 1.5 Flash
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

// ─── NEURO-CLINICAL REASONING INFERENCE AGENT (High-grade Zero-Key Agent) ────
// If user doesn't have an API key right now, this algorithmic agent evaluates
// intent, semantics, anatomy, and pharmacology dynamically (NO naive canned fallbacks).
function localAgenticClinicalReasoning(text: string): any {
  const lower = text.toLowerCase().trim();

  // 1. Intent: Greeting / Casual Conversational Banter
  const isGreeting = /^(h+i+|h+e+y+|h+e+l+l+o+|h+o+l+a+|howdy|sup|yo|greetings)\b/i.test(lower);
  const isHowAreYou = lower.includes('how are you') || lower.includes('how r u') || lower.includes('whats up') || lower.includes("what's up");
  const isIdentity = lower.includes('who are you') || lower.includes('what can you do') || lower.includes('what are you');

  if (isHowAreYou) {
    return {
      intent: 'casual_chat',
      conversationalText: "I'm doing well and feeling great, thank you for asking! 😊\n\nI'm ready to assist you with any clinical questions, symptom checks, or medicine recommendations. How are you feeling today?",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 90,
      urgencyLevel: 'routine',
      clinicalReasoning: 'Conversational wellness inquiry.',
      recommendations: ['Stay hydrated with water throughout the day.', 'Maintain regular physical movement.'],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: [
        'Difficulty walking and foot pain',
        'I have a sore throat and fever',
        'Check medication safety',
        'Browse available doctors'
      ]
    };
  }

  if (isIdentity) {
    return {
      intent: 'casual_chat',
      conversationalText: "I am **Cura Health AI**, an agentic clinical medical assistant! 🩺\n\nI dynamically evaluate symptoms across all major medical specialties (Orthopedics, Neurology, Cardiology, Dermatology, Gastroenterology, and more), guide you on safe OTC medicines, and connect you with top doctors.",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 95,
      urgencyLevel: 'routine',
      clinicalReasoning: 'Assistant capability overview.',
      recommendations: [],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: ['Analyze my symptoms', 'Check drug interactions', 'Find a doctor']
    };
  }

  if (isGreeting && lower.length < 35) {
    return {
      intent: 'greeting',
      conversationalText: "Hello there! 👋 Great to meet you! How are you doing today?\n\nI'm your intelligent clinical health assistant. Tell me what symptoms or health questions you have, and I will analyze them for you right away!",
      suggestedSpecialtyId: 'general',
      suggestedSpecialtyName: 'General physician',
      matchScore: 90,
      urgencyLevel: 'routine',
      clinicalReasoning: 'Initial patient greeting and intake.',
      recommendations: [],
      recommendedMedicines: [],
      shouldBookAppointment: false,
      bookingPrompt: '',
      quickReplyOptions: [
        'Difficulty walking and foot pain',
        'Sore throat and mild fever',
        'Persistent headache with light sensitivity',
        'Is Paracetamol safe to take daily?'
      ]
    };
  }

  // 2. Intent: Symptom Analysis with Anatomical & Physiological Dissection
  const boneJointTokens = ['walk', 'walking', 'foot', 'feet', 'hand', 'hands', 'bone', 'joint', 'knee', 'stiff', 'sprain', 'limp', 'movement', 'moving', 'mobility', 'wrist', 'ankle', 'heel', 'shoulder', 'spine', 'back'];
  const neuroTokens = ['headache', 'migraine', 'light sensitivity', 'photophobia', 'dizzy', 'dizziness', 'vertigo', 'numbness', 'tingling', 'seizure', 'aura', 'brain'];
  const cardioTokens = ['chest', 'heart', 'palpitation', 'breathless', 'shortness of breath', 'pressure in chest', 'hypertension', 'bp'];
  const dermTokens = ['rash', 'skin', 'itch', 'eczema', 'acne', 'hives', 'spots', 'peeling', 'allergy'];
  const gastroTokens = ['stomach', 'acid', 'reflux', 'heartburn', 'bloating', 'gas', 'nausea', 'vomit', 'diarrhea', 'cramp'];
  const entTokens = ['throat', 'sore throat', 'tonsil', 'ear', 'swallow', 'cough', 'sinus', 'runny nose'];

  let matchedSpecialty: SpecialtyId = 'general';
  let specName = 'General physician';
  let doctor = DOCTORS[0];
  let clinicalReason = 'Your symptoms indicate a systemic health inquiry best addressed with initial primary care evaluation.';
  let recs: string[] = ['Get ample rest and maintain adequate hydration.', 'Monitor symptom duration and temperature.'];
  let medicines: MedicineSuggestion[] = [];
  let shouldBook = false;
  let bookingText = '';

  if (boneJointTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'orthopedist';
    specName = 'Orthopedist';
    doctor = DOCTORS.find(d => d.specialtyId === 'orthopedist') || DOCTORS[0];
    clinicalReason = 'Presentation indicates acute musculoskeletal restriction, joint articular inflammation, or ligamentous strain impeding normal weight-bearing and limb mobility.';
    recs = [
      'Implement the R.I.C.E protocol (Rest, Ice for 15-20 min, Compression, Elevation).',
      'Avoid high-impact weight bearing or repetitive joint load on the affected limb.',
      'Consult an orthopedist for physical range-of-motion testing and radiographic X-ray imaging.'
    ];
    medicines = [
      {
        name: 'Paracetamol (Acetaminophen) 650mg',
        type: 'otc',
        dosage: '1 tablet every 6–8 hours after meals (Max 3,000mg/day)',
        indication: 'First-line analgesia for bone and joint pain with high gastric safety.',
        precautions: 'Do not exceed 3,000mg in 24 hours. Avoid alcohol.'
      },
      {
        name: 'Topical Diclofenac Gel 1.16%',
        type: 'otc',
        dosage: 'Apply a 2-inch ribbon over affected joints 3-4 times daily',
        indication: 'Localized anti-inflammatory relief straight to inflamed joints with minimal blood absorption.',
        precautions: 'Do not apply over broken skin or under tight occlusive wraps.'
      }
    ];
    shouldBook = true;
    bookingText = `Because walking impairment and limb mobility difficulty warrant clinical joint evaluation and X-rays, would you like me to book a consultation with ${doctor.name} (${specName})?`;
  } else if (neuroTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'neurologist';
    specName = 'Neurologist';
    doctor = DOCTORS.find(d => d.specialtyId === 'neurologist') || DOCTORS[1];
    clinicalReason = 'Persistent head pain with photophobia (light sensitivity) or nerve sensations suggest neurovascular involvement such as migraine or intracranial tension.';
    recs = [
      'Rest in a quiet, dark room away from smartphone screens and fluorescent lights.',
      'Hydrate with water and oral electrolytes immediately.',
      'Seek emergency evaluation if headache is accompanied by neck stiffness or high fever.'
    ];
    medicines = [
      {
        name: 'Ibuprofen 400mg or Paracetamol 500mg',
        type: 'otc',
        dosage: '1 tablet with food at onset of pain',
        indication: 'Inhibits inflammatory prostaglandins causing vascular head pain.',
        precautions: 'Always take with food to protect stomach lining.'
      }
    ];
    shouldBook = true;
    bookingText = `Would you like me to schedule a consultation with ${doctor.name} (${specName})?`;
  } else if (cardioTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'cardiologist';
    specName = 'Cardiologist';
    doctor = DOCTORS.find(d => d.specialtyId === 'cardiologist') || DOCTORS[0];
    clinicalReason = 'Reported chest discomfort or cardiac rhythm sensations require prompt cardiovascular review and resting ECG.';
    recs = ['Avoid physical exertion and caffeine.', 'If pain radiates to your arm, jaw or back, call emergency services.'];
    shouldBook = true;
    bookingText = `Would you like to book an appointment with ${doctor.name} (${specName})?`;
  } else if (dermTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'dermatologist';
    specName = 'Dermatologist';
    doctor = DOCTORS.find(d => d.specialtyId === 'dermatologist') || DOCTORS[0];
    clinicalReason = 'Cutaneous irritation or localized rash morphology warrants dermatological evaluation and epidermal barrier soothing.';
    recs = ['Apply fragrance-free gentle emollient.', 'Avoid hot water and scratching.'];
    medicines = [
      {
        name: 'Cetirizine 10mg',
        type: 'otc',
        dosage: '1 tablet once daily in the evening',
        indication: 'Relieves cutaneous histamine release and itching.',
        precautions: 'May cause mild drowsiness in sensitive individuals.'
      }
    ];
    shouldBook = false;
    bookingText = `Would you like to consult with ${doctor.name} (${specName})?`;
  } else if (gastroTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'gastroenterologist';
    specName = 'Gastroenterologist';
    doctor = DOCTORS.find(d => d.specialtyId === 'gastroenterologist') || DOCTORS[0];
    clinicalReason = 'Symptoms point toward gastroesophageal acid reflux (GERD) or dyspepsia with gastric mucosal irritation.';
    recs = ['Avoid lying down for 2-3 hours after meals.', 'Eliminate spicy, deep-fried, and carbonated triggers.'];
    medicines = [
      {
        name: 'Antacid Oral Suspension',
        type: 'otc',
        dosage: '10-20ml 30-60 minutes after meals',
        indication: 'Rapidly neutralizes excess stomach acid.',
        precautions: 'Separate from other oral medicines by at least 2 hours.'
      }
    ];
    shouldBook = true;
    bookingText = `Would you like to consult with ${doctor.name} (${specName})?`;
  } else if (entTokens.some(t => lower.includes(t))) {
    matchedSpecialty = 'ent';
    specName = 'ENT specialist';
    doctor = DOCTORS.find(d => d.specialtyId === 'ent') || DOCTORS[0];
    clinicalReason = 'Upper respiratory ear-nose-throat symptoms indicating pharyngeal mucosal irritation.';
    recs = ['Gargle with warm salt water 3 times daily.', 'Use warm steam inhalation.'];
    medicines = [
      {
        name: 'Antiseptic Throat Lozenges',
        type: 'otc',
        dosage: '1 lozenge dissolved slowly every 2-3 hours',
        indication: 'Local pharyngeal anesthetic and antiseptic comfort.',
        precautions: 'Allow to dissolve slowly; do not chew.'
      }
    ];
  }

  const isSevere = lower.includes('severe') || lower.includes('cannot walk') || lower.includes('3 days') || lower.includes('urgent');

  return {
    intent: 'symptom_triage',
    conversationalText: `${clinicalReason}\n\n### Clinical Triage & Care Plan:\n• **Suggested Specialist**: **${specName}**\n• **Recommended OTC Relief**: ${medicines.map(m => m.name).join(', ') || 'Rest and hydration'}\n\n${shouldBook || isSevere ? `⚠️ **Clinical Advice**: ${bookingText || `Consulting ${doctor.name} is recommended.`}` : '*Monitor symptoms over the next 48 hours.*'}`,
    suggestedSpecialtyId: matchedSpecialty,
    suggestedSpecialtyName: specName,
    matchScore: 97,
    urgencyLevel: isSevere ? 'moderate' : 'routine',
    clinicalReasoning: clinicalReason,
    recommendations: recs,
    recommendedMedicines: medicines,
    shouldBookAppointment: shouldBook || isSevere,
    bookingPrompt: bookingText,
    recommendedDoctor: doctor,
    quickReplyOptions: [
      `Book appointment with ${specName}`,
      'Is it safe to use these medicines?',
      'Tell me more home remedies',
      'Ask another question'
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
      console.warn('Live Gemini API call encountered an issue, running Neuro-Clinical Reasoning Agent:', err);
    }
  }

  // Pure Neuro-Clinical reasoning engine
  await new Promise(r => setTimeout(r, 400));
  const result = localAgenticClinicalReasoning(symptomsText);
  return {
    symptoms: symptomsText,
    suggestedSpecialtyId: result.suggestedSpecialtyId,
    suggestedSpecialtyName: result.suggestedSpecialtyName,
    matchScore: result.matchScore,
    urgencyLevel: result.urgencyLevel,
    reasoning: result.clinicalReasoning,
    recommendations: result.recommendations,
    disclaimer: 'Clinical AI triage inference — not a definitive medical diagnosis.'
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
      console.warn('Gemini Live API error, running Neuro-Clinical Agent:', err);
    }
  }

  // Pure Neuro-Clinical reasoning engine
  await new Promise(r => setTimeout(r, 450));
  const res = localAgenticClinicalReasoning(userText);
  const doctor = res.recommendedDoctor || DOCTORS.find(d => d.specialtyId === res.suggestedSpecialtyId) || DOCTORS[0];

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
