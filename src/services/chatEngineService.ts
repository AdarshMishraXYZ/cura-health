import { ChatMessage, Doctor, MedicineSuggestion } from '../types';
import { DOCTORS } from '../data/doctors';

export function getInitialChatMessages(): ChatMessage[] {
  return [
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: "Hello! I am your **Cura Clinical AI Assistant**. I can help you with:\n\n• **Symptom checks & health inquiries**\n• **OTC medicine suggestions, safety & dosages**\n• **Lifestyle & preventative care tips**\n• **Intelligent specialist booking** (when clinically recommended)\n\nHow can I help you today?",
      timestamp: 'Just now',
      options: [
        'Sore throat and mild fever since yesterday',
        'Persistent headache with light sensitivity for 3 days',
        'Is Paracetamol safe to take with other medicines?',
        'Severe acid reflux and stomach bloating',
        'How can I improve my sleep quality?'
      ]
    }
  ];
}

// Database of smart clinical knowledge & medicine recommendations
interface ClinicalKnowledge {
  keywords: string[];
  explanation: string;
  medicines: MedicineSuggestion[];
  homeRemedies: string[];
  severity: 'mild' | 'moderate' | 'high';
  shouldAskBooking: boolean;
  specialtyId: string;
  recommendedDoctor: Doctor;
  bookingPromptText: string;
}

const CLINICAL_KNOWLEDGE_BASE: ClinicalKnowledge[] = [
  {
    keywords: ['throat', 'sore throat', 'fever', 'pharyngitis', 'cold', 'flu', 'cough', 'chills'],
    explanation: 'Your symptoms point toward an acute upper respiratory or viral pharyngeal irritation. Most acute viral throat infections resolve within 3-7 days with supportive symptomatic care and adequate hydration.',
    medicines: [
      {
        name: 'Paracetamol (Acetaminophen)',
        type: 'otc',
        dosage: '500mg - 650mg every 6 hours after food (Max 3000mg/24h)',
        indication: 'Antipyretic for fever reduction and analgesic for throat/body aches.',
        precautions: 'Do not exceed 3000mg per day. Avoid alcohol and check other cold medicines to avoid accidental acetaminophen overdose.'
      },
      {
        name: 'Antiseptic Throat Lozenges',
        type: 'otc',
        dosage: '1 lozenge dissolved slowly in mouth every 2-3 hours (Max 8/day)',
        indication: 'Provides topical local anesthetic and antiseptic coating for pharyngeal comfort.',
        precautions: 'Do not chew or swallow whole. Allow to dissolve completely.'
      },
      {
        name: 'Warm Saline Gargle',
        type: 'home_remedy',
        dosage: '1/2 teaspoon non-iodized salt in 1 glass warm water, 3 times daily',
        indication: 'Reduces pharyngeal mucosal edema and clears excess mucus.',
        precautions: 'Spit out completely after gargling; do not swallow.'
      },
      {
        name: 'Vitamin C & Zinc Supp',
        type: 'supplement',
        dosage: '500mg Vitamin C + 15mg Zinc once daily with food',
        indication: 'Supports leukocyte cellular immunity during acute viral replication.',
        precautions: 'Take after a meal to prevent mild nausea.'
      }
    ],
    homeRemedies: [
      'Drink warm water, herbal teas with raw honey and lemon.',
      'Use a cool mist humidifier or warm steam inhalation.',
      'Ensure 8+ hours of uninterrupted sleep for immune restoration.'
    ],
    severity: 'mild',
    shouldAskBooking: false,
    specialtyId: 'general',
    recommendedDoctor: DOCTORS[0], // Dr. Richard James
    bookingPromptText: "If your fever exceeds 101°F (38.3°C), lasts beyond 48 hours, or makes swallowing difficult, would you like me to book a quick consultation with Dr. Richard James (General physician)?"
  },
  {
    keywords: ['headache', 'migraine', 'light sensitivity', 'photophobia', 'head pain', 'temple', 'aura'],
    explanation: 'The combination of persistent head pain and light sensitivity (photophobia) strongly suggests migraine or intracranial tension. Migraines involve neurovascular dilation and sensory nerve hyper-excitability.',
    medicines: [
      {
        name: 'Ibuprofen or Paracetamol',
        type: 'otc',
        dosage: 'Ibuprofen 400mg OR Paracetamol 500mg at onset of pain (with food)',
        indication: 'Inhibits inflammatory prostaglandins causing vascular head pain.',
        precautions: 'Always take NSAIDs with food or milk. Avoid ibuprofen if you have active gastritis, kidney issues, or stomach ulcers.'
      },
      {
        name: 'Magnesium Glycinate',
        type: 'supplement',
        dosage: '300mg - 400mg daily in the evening',
        indication: 'Promotes neurovascular relaxation and dampens cortical spreading depression.',
        precautions: 'High doses may cause mild laxative effects.'
      },
      {
        name: 'Cold Gel Pack Application',
        type: 'home_remedy',
        dosage: 'Applied to forehead/temples for 15-20 minutes with eyes closed',
        indication: 'Promotes vasoconstriction to reduce throbbing cranial pulsation.',
        precautions: 'Wrap pack in a thin cloth; avoid direct ice contact with skin.'
      }
    ],
    homeRemedies: [
      'Rest in a quiet, dark room with smartphone screens and blue light eliminated.',
      'Hydrate with 500ml of water or electrolyte solution immediately.',
      'Practice slow diaphragmatic breathing to reduce muscular cervical tension.'
    ],
    severity: 'moderate',
    shouldAskBooking: true,
    specialtyId: 'neurologist',
    recommendedDoctor: DOCTORS[4], // Dr. Zoe Kelly
    bookingPromptText: "Because your headache has persisted for 3 days with light sensitivity, a neurological evaluation is clinically recommended to check intracranial pressure. Would you like me to arrange an appointment with Dr. Zoe Kelly (Neurologist)?"
  },
  {
    keywords: ['acidity', 'reflux', 'heartburn', 'gerd', 'stomach', 'indigestion', 'bloating', 'gas', 'nausea'],
    explanation: 'Symptoms indicate gastroesophageal reflux (GERD) or dyspepsia, where gastric hydrochloric acid backflows into the esophageal sphincter causing mucosal irritation and burning.',
    medicines: [
      {
        name: 'Antacid Oral Suspension / Chewables',
        type: 'otc',
        dosage: '10-20ml (or 1-2 chewable tablets) 30-60 minutes after meals and at bedtime',
        indication: 'Rapidly neutralizes excess gastric acid and coats stomach lining.',
        precautions: 'Separate from other oral medications by at least 2 hours.'
      },
      {
        name: 'Famotidine (H2 Blocker)',
        type: 'otc',
        dosage: '10mg - 20mg once or twice daily, taken 15-30 minutes before meal',
        indication: 'Reduces gastric acid production for sustained 10-12 hour relief.',
        precautions: 'Do not take continuously for more than 14 days without physician supervision.'
      },
      {
        name: 'Ginger & Chamomile Infusion',
        type: 'home_remedy',
        dosage: '1 cup warm freshly brewed ginger/chamomile tea after meals',
        indication: 'Natural anti-spasmodic and gastrointestinal anti-inflammatory.',
        precautions: 'Avoid adding citrus or excess sugar.'
      }
    ],
    homeRemedies: [
      'Avoid lying down or reclining for at least 2 to 3 hours after eating.',
      'Elevate the head of your bed by 6 inches with a wedge pillow.',
      'Eliminate trigger foods: coffee, carbonated sodas, citrus, chocolate, and deep-fried dishes.'
    ],
    severity: 'moderate',
    shouldAskBooking: true,
    specialtyId: 'gastroenterologist',
    recommendedDoctor: DOCTORS[9], // Dr. Sara Miles
    bookingPromptText: "If your acidity is recurrent or accompanied by difficulty swallowing, would you like me to book a consultation with Dr. Sara Miles (Gastroenterologist)?"
  },
  {
    keywords: ['rash', 'itch', 'skin', 'eczema', 'allergy', 'hives', 'urticaria', 'red spots'],
    explanation: 'Cutaneous flare-up, localized contact dermatitis, or histamine release. It is important to soothe the epidermal barrier and stop the itch-scratch cycle to prevent secondary bacterial infection.',
    medicines: [
      {
        name: 'Cetirizine / Loratadine',
        type: 'otc',
        dosage: '10mg once daily in the evening',
        indication: 'Second-generation non-drowsy antihistamine that blocks H1 receptors and calms systemic itching.',
        precautions: 'May cause mild drowsiness in sensitive individuals. Avoid alcohol.'
      },
      {
        name: 'Calamine Lotion / 1% Hydrocortisone Cream',
        type: 'otc',
        dosage: 'Apply a thin layer over affected skin 2 times daily',
        indication: 'Topical anti-pruritic and anti-inflammatory soothing barrier.',
        precautions: 'Do not apply to open cuts, blisters, or infected weeping skin.'
      },
      {
        name: 'Cool Oatmeal Bath / Compress',
        type: 'home_remedy',
        dosage: '15 minutes soak in lukewarm water with colloidal oatmeal',
        indication: 'Replenishes skin lipids and soothes cutaneous inflammation.',
        precautions: 'Pat skin dry gently with a clean towel; do not rub vigorously.'
      }
    ],
    homeRemedies: [
      'Wear loose, 100% breathable cotton clothing.',
      'Apply a fragrance-free ceramides-based moisturizer right after bathing.',
      'Keep fingernails trimmed short to avoid damaging skin when sleeping.'
    ],
    severity: 'mild',
    shouldAskBooking: false,
    specialtyId: 'dermatologist',
    recommendedDoctor: DOCTORS[7], // Dr. Chloe Chen
    bookingPromptText: "If the rash spreads rapidly, becomes painful, or does not improve in 3 days, would you like to schedule an appointment with Dr. Chloe Chen (Dermatologist)?"
  },
  {
    keywords: ['knee', 'joint', 'back pain', 'bone', 'sprain', 'stiffness', 'shoulder', 'muscle ache'],
    explanation: 'Musculoskeletal inflammation or ligament strain. Initial management focuses on active rest, cold therapy to reduce acute vascular effusion, and supporting joint biomechanics.',
    medicines: [
      {
        name: 'Paracetamol 650mg or Naproxen 220mg',
        type: 'otc',
        dosage: 'Paracetamol every 6-8 hours or Naproxen twice daily with meal',
        indication: 'Symptomatic analgesia for acute musculoskeletal discomfort.',
        precautions: 'Do not combine multiple oral NSAIDs together.'
      },
      {
        name: 'Topical Diclofenac 1% Gel',
        type: 'otc',
        dosage: 'Gently rub 2-4g onto the affected joint 3 to 4 times daily',
        indication: 'Localized anti-inflammatory relief with minimal systemic absorption.',
        precautions: 'Wash hands after application. Do not apply under tight occlusive wraps.'
      }
    ],
    homeRemedies: [
      'R.I.C.E Protocol: Rest the joint, Ice for 15-20 min every 3 hours, Compress with elastic bandage, Elevate.',
      'Gentle range-of-motion stretching without putting weight on the joint.',
      'Use supportive cushioned footwear.'
    ],
    severity: 'moderate',
    shouldAskBooking: true,
    specialtyId: 'orthopedist',
    recommendedDoctor: DOCTORS[13], // Dr. Aaron Hayes
    bookingPromptText: "If you cannot bear weight on the joint, or if swelling is severe, an orthopedic clinical evaluation and X-ray are advised. Would you like me to book Dr. Aaron Hayes (Orthopedist)?"
  },
  {
    keywords: ['blood pressure', 'hypertension', 'heart', 'cholesterol', 'palpitations', 'cardio'],
    explanation: 'Cardiovascular maintenance requires lifestyle interventions focusing on arterial elasticity, sodium restriction, and regular aerobic endurance.',
    medicines: [
      {
        name: 'Omega-3 Fatty Acids (EPA/DHA)',
        type: 'supplement',
        dosage: '1000mg daily with breakfast',
        indication: 'Supports endothelial function and healthy triglyceride clearance.',
        precautions: 'Consult physician if taking anticoagulants or blood thinners.'
      },
      {
        name: 'Coenzyme Q10 (CoQ10)',
        type: 'supplement',
        dosage: '100mg once daily',
        indication: 'Myocardial bioenergetic cofactor and antioxidant support.',
        precautions: 'Take with a fat-containing meal for optimal absorption.'
      }
    ],
    homeRemedies: [
      'DASH Diet principles: Limit sodium to under 2,000 mg/day; increase potassium via bananas, leafy greens, and avocados.',
      'Engage in 30 minutes of moderate aerobic activity (brisk walking, swimming) 5 days a week.',
      'Practice 10 minutes of heart-rate variability (HRV) coherent breathing.'
    ],
    severity: 'moderate',
    shouldAskBooking: true,
    specialtyId: 'cardiologist',
    recommendedDoctor: DOCTORS[5], // Dr. Marcus Vance
    bookingPromptText: "Would you like me to arrange a cardiovascular risk evaluation with Dr. Marcus Vance (Cardiologist)?"
  }
];

export async function processUserMessage(
  userText: string,
  chatHistory: ChatMessage[]
): Promise<ChatMessage[]> {
  // Simulate AI model reasoning delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lower = userText.toLowerCase().trim();

  // ----------------------------------------------------
  // 1. SPECIFIC CHECK: Medication Safety, Interactions & Precautions
  // (e.g. "is it safe to use?", "are the medicines safe?", "is paracetamol safe?")
  // ----------------------------------------------------
  const isSafetyQuestion = 
    lower.includes('is it safe') ||
    lower.includes('is this safe') ||
    lower.includes('are they safe') ||
    lower.includes('are these safe') ||
    lower.includes('safe to use') ||
    lower.includes('safe to take') ||
    lower.includes('side effect') ||
    lower.includes('side effects') ||
    lower.includes('contraindication') ||
    lower.includes('harmful') ||
    lower.includes('overdose') ||
    lower.includes('danger') ||
    lower.includes('precautions') ||
    lower.includes('safe for pregnant') ||
    lower.includes('take together');

  if (isSafetyQuestion) {
    return [
      {
        id: `m-safety-${Date.now()}`,
        sender: 'assistant',
        text: `### Clinical Medication Safety & Usage Guide 🛡️\n\nYes, the suggested Over-The-Counter (OTC) medications have well-established safety profiles when used according to recommended therapeutic dosages:\n\n• **Paracetamol (Acetaminophen)**:\n  - **Safety**: Very safe for most adults and children when respecting limits.\n  - **Key Rule**: Never exceed **3,000 mg in 24 hours** (e.g. max six 500mg tablets per day).\n  - **Caution**: Avoid consuming alcohol; do not combine with multi-symptom cold syrups that also contain acetaminophen.\n\n• **Ibuprofen & NSAIDs**:\n  - **Safety**: Effective anti-inflammatory analgesic.\n  - **Key Rule**: Always take with food or milk to safeguard the gastric mucosal barrier.\n  - **Caution**: Avoid if you have a history of stomach ulcers, chronic kidney disease, or are in late pregnancy.\n\n• **Antacids & H2 Blockers (Famotidine)**:\n  - **Safety**: Very well-tolerated.\n  - **Key Rule**: Separate from other prescription drugs by at least 2 hours to avoid binding interactions.\n\n• **Antihistamines (Cetirizine / Loratadine)**:\n  - **Safety**: Non-drowsy second-generation formula. Avoid mixing with sedative medications.\n\n⚠️ **When to consult a doctor first**:\nIf you are pregnant, breastfeeding, have impaired liver or kidney function, or take prescription blood thinners (like Warfarin/Aspirin). Would you like to schedule a quick consultation with a doctor to review your medical history?`,
        timestamp: 'Just now',
        options: [
          'Can I take Paracetamol and Ibuprofen together?',
          'Yes, I want to book a doctor consultation',
          'What are alternative home remedies?'
        ],
        actions: [
          {
            id: 'act-book-doc',
            label: 'Consult with a General Physician',
            variant: 'primary',
            actionType: 'propose_booking',
            payload: { doctor: DOCTORS[0] }
          }
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 2. CHECK: Drug Combination / Staggering Question
  // (e.g. "can I take paracetamol and ibuprofen together?")
  // ----------------------------------------------------
  if (lower.includes('paracetamol and ibuprofen') || lower.includes('together') || lower.includes('alternate')) {
    return [
      {
        id: `m-comb-${Date.now()}`,
        sender: 'assistant',
        text: `### Taking Paracetamol & Ibuprofen Together 💊\n\n**Yes, they can be safely alternated or taken together** because they belong to completely different drug classes and are processed by different organ pathways:\n\n• **Paracetamol** is an analgesic/antipyretic metabolized primarily by the **liver**.\n• **Ibuprofen** is an NSAID anti-inflammatory processed and cleared through the **kidneys**.\n\n**Recommended Staggering Protocol**:\n1. Take Paracetamol (500mg) at 0 hours.\n2. If pain or fever persists, take Ibuprofen (400mg with food) 3 hours later.\n3. Take next Paracetamol dose 3 hours after that.\n\n*Always respect maximum 24-hour limits for each medication.*`,
        timestamp: 'Just now',
        options: [
          'What about taking with antibiotics?',
          'Is this safe for children?',
          'Book an appointment with a doctor'
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 3. CHECK: Conversational Clarifications ("no i mean...", "i meant...")
  // ----------------------------------------------------
  if (lower.startsWith('no ') || lower.startsWith('i mean') || lower.startsWith('i meant') || lower.includes('what i meant')) {
    // If it mentions medicine or safety
    if (lower.includes('medicine') || lower.includes('pill') || lower.includes('drug') || lower.includes('remedy') || lower.includes('safe')) {
      return [
        {
          id: `m-clarify-${Date.now()}`,
          sender: 'assistant',
          text: `Got it! Thanks for clarifying. 😊\n\nRegarding the medications we discussed:\nAll recommended OTC treatments (like Paracetamol, Lozenges, Famotidine, and Cetirizine) are clinically approved and widely considered safe for standard short-term use (under 3–5 days).\n\nKey safety rules:\n1. **Take with water or food** (especially NSAIDs like Ibuprofen).\n2. **Do not exceed package dose instructions**.\n3. **Do not mix with alcohol**.\n\nDo you have any existing health conditions (such as liver disease, gastric reflux, or asthma) that I should factor in?`,
          timestamp: 'Just now',
          options: [
            'No existing health conditions',
            'I have mild asthma or stomach acid',
            'I would prefer to consult a doctor first'
          ]
        }
      ];
    }
  }

  // ----------------------------------------------------
  // 4. CHECK: Greetings & Pleasantries
  // ----------------------------------------------------
  const isGreeting = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings|hola)\b/i.test(lower);
  if (isGreeting && lower.length < 35) {
    return [
      {
        id: `m-greet-${Date.now()}`,
        sender: 'assistant',
        text: "Hello! 😊 I'm your **Cura Clinical AI Assistant**. I can help you with symptom triage, safe medication guidelines, home remedies, and scheduling specialist consultations. How are you feeling today?",
        timestamp: 'Just now',
        options: [
          'Sore throat and mild fever since yesterday',
          'Persistent headache with light sensitivity for 3 days',
          'Are OTC pain relievers safe for me?',
          'How can I lower my cholesterol naturally?'
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 5. CHECK: Gratitude ("Thank you", "Thanks")
  // ----------------------------------------------------
  if (lower.includes('thank') || lower.includes('appreciate') || lower.includes('helpful') || lower.includes('great')) {
    return [
      {
        id: `m-thanks-${Date.now()}`,
        sender: 'assistant',
        text: "You're very welcome! Taking proactive care of your health is essential. Remember to stay hydrated, get restful sleep, and don't hesitate to reach out if your symptoms change or if you'd like to book an appointment with a specialist.",
        timestamp: 'Just now',
        options: [
          'Ask another health question',
          'Browse available doctors',
          'View my health records'
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 6. CHECK: Identity & Capability ("Who are you?", "What can you do?")
  // ----------------------------------------------------
  if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('how does this work')) {
    return [
      {
        id: `m-identity-${Date.now()}`,
        sender: 'assistant',
        text: "I am **Cura Health AI**, an intelligent clinical assistant designed to:\n\n1. **Analyze Symptoms & Lab Reports** using evidence-based clinical guidelines.\n2. **Recommend Safe OTC Medicines, Dosages & Home Remedies** for common conditions.\n3. **Assess Clinical Urgency** and recommend when you need in-person or telehealth care.\n4. **Seamlessly Book Specialists** when symptoms warrant formal doctor consultation.\n\n*Note: My recommendations assist triage and education and do not replace formal physician diagnosis.*",
        timestamp: 'Just now',
        options: [
          'Analyze my current symptoms',
          'Ask about a medication',
          'Browse medical specialists'
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 7. CHECK: Lifestyle questions (Sleep, Stress, Diet)
  // ----------------------------------------------------
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired') || lower.includes('stress')) {
    return [
      {
        id: `m-lifestyle-${Date.now()}`,
        sender: 'assistant',
        text: "### Evidence-Based Sleep & Recovery Protocol 🌙\n\nQuality sleep is foundational for cellular repair, neuroplasticity, and immune function:\n\n• **Circadian Rhythm Alignment**: Get 10–15 minutes of natural sunlight within 1 hour of waking up.\n• **Digital Sun-down**: Avoid bright LED/OLED screens 60 minutes before bed; blue light suppresses melatonin release.\n• **Temperature Optimization**: Keep your bedroom cool (around 65–68°F / 18–20°C).\n• **Caffeine Cut-off**: Cease caffeine consumption 8 hours before sleep.\n\n**Natural Sleep Aids (OTC/Supplements)**:\n• *Magnesium Bisglycinate*: 200–300mg taken 30 mins before sleep.\n• *Chamomile or Passionflower Infusion*: Calming herbal tea without caffeine.",
        timestamp: 'Just now',
        medicines: [
          {
            name: 'Magnesium Bisglycinate',
            type: 'supplement',
            dosage: '200mg - 300mg taken 30-45 minutes before bedtime',
            indication: 'Enhances parasympathetic nervous tone and deep slow-wave sleep.',
            precautions: 'Take with a sip of water. Non-habit forming.'
          }
        ],
        options: [
          'Yes, chronic fatigue for weeks',
          'Just occasional difficulty falling asleep',
          'Can lack of sleep cause headaches?'
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 8. CHECK: User wants or confirms doctor booking
  // ----------------------------------------------------
  const wantsBooking = 
    lower.includes('yes') || 
    lower.includes('book') || 
    lower.includes('appointment') || 
    lower.includes('schedule') || 
    lower.includes('consult') || 
    lower.includes('doctor') ||
    lower.includes('morning') ||
    lower.includes('tomorrow') ||
    lower.includes('today');

  if (wantsBooking && (lower.includes('yes') || lower.includes('book') || lower.includes('morning') || lower.includes('tomorrow') || lower.includes('today') || lower.includes('schedule'))) {
    // Find what specialty was discussed in previous messages
    const pastText = chatHistory.map(m => m.text).join(' ').toLowerCase();

    let matchedDoc: Doctor = DOCTORS[0]; // Dr. Richard James
    let matchedDate = 'Sun, 27 · 9:30 AM';
    let matchedTime = '09:30 AM';

    if (pastText.includes('headache') || pastText.includes('migraine') || pastText.includes('light') || pastText.includes('neuro')) {
      matchedDoc = DOCTORS.find(d => d.specialtyId === 'neurologist') || DOCTORS[4]; // Dr. Zoe Kelly
      matchedDate = 'Mon, 28 · 10:00 AM';
      matchedTime = '10:00 AM';
    } else if (pastText.includes('heart') || pastText.includes('blood pressure') || pastText.includes('cardio')) {
      matchedDoc = DOCTORS.find(d => d.specialtyId === 'cardiologist') || DOCTORS[7]; // Dr. Marcus Vance
      matchedDate = 'Sun, 27 · 11:30 AM';
      matchedTime = '11:30 AM';
    } else if (pastText.includes('rash') || pastText.includes('skin') || pastText.includes('itch')) {
      matchedDoc = DOCTORS.find(d => d.specialtyId === 'dermatologist') || DOCTORS[9]; // Dr. Chloe Chen
      matchedDate = 'Sun, 27 · 10:00 AM';
      matchedTime = '10:00 AM';
    } else if (pastText.includes('stomach') || pastText.includes('acid') || pastText.includes('reflux')) {
      matchedDoc = DOCTORS.find(d => d.specialtyId === 'gastroenterologist') || DOCTORS[11]; // Dr. Sara Miles
      matchedDate = 'Sun, 27 · 02:00 PM';
      matchedTime = '02:00 PM';
    } else if (pastText.includes('knee') || pastText.includes('bone') || pastText.includes('joint')) {
      matchedDoc = DOCTORS.find(d => d.specialtyId === 'orthopedist') || DOCTORS[15]; // Dr. Aaron Hayes
      matchedDate = 'Sun, 27 · 02:30 PM';
      matchedTime = '02:30 PM';
    }

    if (lower.includes('today')) {
      matchedDate = 'Sat, 26 · 4:00 PM';
      matchedTime = '04:00 PM';
    } else if (lower.includes('morning')) {
      matchedDate = 'Sun, 27 · 9:30 AM';
      matchedTime = '09:30 AM';
    } else if (lower.includes('evening') || lower.includes('afternoon')) {
      matchedDate = 'Sun, 27 · 3:30 PM';
      matchedTime = '03:30 PM';
    }

    return [
      {
        id: `m-prop-${Date.now()}`,
        sender: 'assistant',
        text: `I've prepared a recommended consultation with **${matchedDoc.name}** (${matchedDoc.specialtyName}) based on your clinical symptoms. You can confirm directly below or choose another slot:`,
        timestamp: 'Just now',
        proposedDoctor: matchedDoc,
        proposedSlot: {
          date: matchedDate,
          time: matchedTime,
          fee: matchedDoc.consultationFee
        },
        actions: [
          {
            id: 'choose-another',
            label: 'Choose Another Doctor',
            actionType: 'show_doctors'
          }
        ]
      }
    ];
  }

  // ----------------------------------------------------
  // 9. Match against Clinical Knowledge Base for Symptoms & Medicines
  // ----------------------------------------------------
  let bestMatch: ClinicalKnowledge | null = null;
  let maxMatches = 0;

  for (const knowledge of CLINICAL_KNOWLEDGE_BASE) {
    let count = 0;
    for (const kw of knowledge.keywords) {
      if (lower.includes(kw)) {
        count++;
      }
    }
    if (count > maxMatches) {
      maxMatches = count;
      bestMatch = knowledge;
    }
  }

  if (bestMatch && maxMatches > 0) {
    const isPersistentOrSevere = 
      lower.includes('3 days') || 
      lower.includes('4 days') || 
      lower.includes('week') || 
      lower.includes('persistent') || 
      lower.includes('severe') || 
      lower.includes('worsening') ||
      lower.includes('not getting better') ||
      bestMatch.severity === 'moderate' || 
      bestMatch.severity === 'high';

    let responseText = `${bestMatch.explanation}\n\n### 💊 Recommended OTC Relief & Dosages:\n`;

    if (bestMatch.homeRemedies.length > 0) {
      responseText += `\n**Practical Self-Care Steps:**\n` + bestMatch.homeRemedies.map(r => `• ${r}`).join('\n') + `\n\n`;
    }

    if (isPersistentOrSevere) {
      responseText += `⚠️ **Clinical Observation**: ${bestMatch.bookingPromptText}`;
    } else {
      responseText += `*If symptoms do not improve within 48–72 hours or if fever develops, consulting a physician is advised.*`;
    }

    const options = isPersistentOrSevere
      ? [
          'Yes, please schedule an appointment',
          'Is it safe to use these medicines?',
          'Tell me more home remedies',
          'How long will recovery take?'
        ]
      : [
          'Is it safe to use these medicines?',
          'Can I book a doctor anyway?',
          'Tell me more home remedies'
        ];

    return [
      {
        id: `m-clin-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: 'Just now',
        medicines: bestMatch.medicines,
        shouldAskBooking: isPersistentOrSevere,
        options,
        actions: isPersistentOrSevere
          ? [
              {
                id: 'act-book',
                label: `Book ${bestMatch.recommendedDoctor.specialtyName}`,
                variant: 'primary',
                actionType: 'propose_booking',
                payload: { doctor: bestMatch.recommendedDoctor }
              },
              {
                id: 'act-all-docs',
                label: 'View All Matching Doctors',
                variant: 'outline',
                actionType: 'show_doctors',
                payload: { specialtyId: bestMatch.specialtyId }
              }
            ]
          : undefined
      }
    ];
  }

  // ----------------------------------------------------
  // 10. Intelligent, Human-like Conversational Fallback (NO robotic template!)
  // ----------------------------------------------------
  return [
    {
      id: `m-fallback-${Date.now()}`,
      sender: 'assistant',
      text: `I'm here to help with **${userText.trim()}**.\n\nCould you share a bit more context about what symptoms you are experiencing, how long you've had them, or which specific medicine you'd like me to evaluate for safety?`,
      timestamp: 'Just now',
      options: [
        'Is Paracetamol safe to take daily?',
        'I have a sore throat and slight fever',
        'I have a persistent headache',
        'Show me available General Physicians'
      ]
    }
  ];
}
