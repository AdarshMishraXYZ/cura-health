import { SpecialtyId, SymptomAnalysisResult } from '../types';

interface SpecialtyRule {
  specialtyId: SpecialtyId;
  specialtyName: string;
  keywords: string[];
  reasoning: string;
  recommendations: string[];
}

const SPECIALTY_RULES: SpecialtyRule[] = [
  {
    specialtyId: 'neurologist',
    specialtyName: 'Neurologist',
    keywords: ['headache', 'migraine', 'light sensitivity', 'photophobia', 'dizziness', 'vertigo', 'numbness', 'tingling', 'seizure', 'memory', 'neuralgia', 'nerve'],
    reasoning: 'The symptoms of persistent headache combined with light sensitivity (photophobia) are hallmark clinical indicators of neurological involvement, such as migraine with aura or intracranial pressure anomalies.',
    recommendations: [
      'Rest in a quiet, darkened room away from screens.',
      'Maintain adequate hydration and monitor blood pressure.',
      'Seek immediate emergency care if you experience sudden "thunderclap" headache, stiff neck, or loss of balance.'
    ]
  },
  {
    specialtyId: 'cardiologist',
    specialtyName: 'Cardiologist',
    keywords: ['chest pain', 'chest tightness', 'heart', 'palpitations', 'fluttering', 'shortness of breath', 'dyspnea', 'hypertension', 'blood pressure'],
    reasoning: 'Reported chest discomfort and cardiac rhythm abnormalities warrant timely electrocardiogram (ECG) and cardiovascular assessment to rule out ischemia or arrhythmia.',
    recommendations: [
      'Avoid strenuous physical exertion until cleared.',
      'Avoid high caffeine or nicotine intake.',
      'If chest pain radiates to your jaw, back, or left arm, call emergency medical services immediately.'
    ]
  },
  {
    specialtyId: 'dermatologist',
    specialtyName: 'Dermatologist',
    keywords: ['rash', 'skin', 'itching', 'eczema', 'acne', 'mole', 'hives', 'urticaria', 'lesion', 'scalp', 'hair loss'],
    reasoning: 'Cutaneous flare-ups, localized dermatitis, or unfamiliar rash morphologies benefit from targeted dermatological evaluation and dermoscopy.',
    recommendations: [
      'Apply a gentle fragrance-free hypoallergenic emollient.',
      'Avoid scratching to prevent secondary bacterial infection.',
      'Take photos of the rash progression to share during your consultation.'
    ]
  },
  {
    specialtyId: 'gastroenterologist',
    specialtyName: 'Gastroenterologist',
    keywords: ['stomach', 'acid', 'reflux', 'heartburn', 'bloating', 'cramp', 'nausea', 'vomit', 'diarrhea', 'constipation', 'abdomen', 'gut'],
    reasoning: 'Digestive tract inflammation, recurrent acid regurgitation, or persistent abdominal discomfort indicate upper gastrointestinal or metabolic involvement.',
    recommendations: [
      'Eat smaller, frequent meals and avoid lying down for 2 hours post meals.',
      'Limit spicy, acidic, and deep-fried foods.',
      'Stay hydrated with electrolyte fluids.'
    ]
  },
  {
    specialtyId: 'orthopedist',
    specialtyName: 'Orthopedist',
    keywords: ['joint', 'knee', 'back pain', 'spine', 'shoulder', 'bone', 'stiffness', 'sprain', 'fracture', 'ligament', 'swollen ankle'],
    reasoning: 'Musculoskeletal limitation, articular pain, or joint effusion require orthopedic evaluation, joint stability tests, and potential radiographic imaging.',
    recommendations: [
      'Apply the R.I.C.E protocol (Rest, Ice, Compression, Elevation) if acute swelling is present.',
      'Avoid heavy lifting or high-impact joint loading.',
      'Use supportive footwear or knee brace.'
    ]
  },
  {
    specialtyId: 'ent',
    specialtyName: 'ENT specialist',
    keywords: ['sore throat', 'tonsil', 'ear', 'hearing', 'tinnitus', 'sinus', 'congestion', 'runny nose', 'hoarse', 'nasal'],
    reasoning: 'Upper respiratory ear-nose-throat symptoms such as persistent pharyngitis or sinus pressure indicate localized mucosal inflammation.',
    recommendations: [
      'Gargle with warm saline solution 2-3 times daily.',
      'Use warm steam inhalation for sinus decongestion.',
      'Drink warm soothing teas with honey.'
    ]
  },
  {
    specialtyId: 'gynecologist',
    specialtyName: 'Gynecologist',
    keywords: ['period', 'menstrual', 'pelvic', 'pregnancy', 'cramps', 'ovary', 'pcos', 'hormone', 'vaginal', 'cycle'],
    reasoning: 'Pelvic symptoms, cycle irregularities, or reproductive health concerns require focused gynecological and ultrasound evaluation.',
    recommendations: [
      'Log dates and symptom severity in your cycle tracking diary.',
      'Use a warm compress on lower abdomen for pelvic discomfort.'
    ]
  },
  {
    specialtyId: 'pediatrician',
    specialtyName: 'Pediatrician',
    keywords: ['child', 'baby', 'infant', 'toddler', 'son', 'daughter', 'pediatric', 'vaccine', 'teething'],
    reasoning: 'Pediatric physiology requires age-adjusted dosages and specialized developmental clinical evaluation.',
    recommendations: [
      'Ensure comfortable clothing and maintain regular hydration.',
      'Keep a temperature log every 4 hours.'
    ]
  }
];

export async function analyzeSymptomsWithAi(symptomsText: string): Promise<SymptomAnalysisResult> {
  // Simulate AI model reasoning latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lowerText = symptomsText.toLowerCase();

  let matchedRule: SpecialtyRule | null = null;
  let highestScore = 0;

  for (const rule of SPECIALTY_RULES) {
    let matches = 0;
    for (const kw of rule.keywords) {
      if (lowerText.includes(kw)) {
        matches++;
      }
    }
    if (matches > 0) {
      const score = Math.min(98, 65 + matches * 12);
      if (score > highestScore) {
        highestScore = score;
        matchedRule = rule;
      }
    }
  }

  // Default fallback is General Physician
  if (!matchedRule) {
    matchedRule = {
      specialtyId: 'general',
      specialtyName: 'General physician',
      keywords: [],
      reasoning: 'Your symptoms suggest an acute general systemic or viral condition best evaluated initially by a primary care physician for comprehensive triage.',
      recommendations: [
        'Rest adequately and monitor body temperature.',
        'Hydrate with water and oral electrolyte fluids.',
        'Consult a general physician for complete diagnostic examination.'
      ]
    };
    highestScore = 88;
  }

  // Determine triage urgency
  let urgency: SymptomAnalysisResult['urgencyLevel'] = 'routine';
  if (lowerText.includes('severe') || lowerText.includes('chest') || lowerText.includes('sudden') || lowerText.includes('3 days') || lowerText.includes('high fever')) {
    urgency = 'moderate';
  }
  if (lowerText.includes('cannot breathe') || lowerText.includes('passed out') || lowerText.includes('unbearable') || lowerText.includes('blood')) {
    urgency = 'high_attention';
  }

  return {
    symptoms: symptomsText,
    suggestedSpecialtyId: matchedRule.specialtyId,
    suggestedSpecialtyName: matchedRule.specialtyName,
    matchScore: highestScore,
    urgencyLevel: urgency,
    reasoning: matchedRule.reasoning,
    recommendations: matchedRule.recommendations,
    disclaimer: 'Assists triage only — not a medical diagnosis.'
  };
}
