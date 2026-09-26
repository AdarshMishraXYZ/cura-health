export interface PresetSymptom {
  title: string;
  query: string;
  expectedSpecialty: string;
  icon: string;
}

export const PRESET_SYMPTOMS: PresetSymptom[] = [
  {
    title: 'Headache & Light Sensitivity',
    query: "I've had a persistent headache with light sensitivity for the past 3 days.",
    expectedSpecialty: 'Neurologist',
    icon: 'Brain'
  },
  {
    title: 'Sore Throat & Fever',
    query: "Sore throat and mild fever since yesterday with slight body ache.",
    expectedSpecialty: 'General physician',
    icon: 'Stethoscope'
  },
  {
    title: 'Chest Discomfort & Palpitations',
    query: "Occasional racing heartbeat and tightness in chest after climbing stairs.",
    expectedSpecialty: 'Cardiologist',
    icon: 'HeartPulse'
  },
  {
    title: 'Persistent Skin Rash & Itch',
    query: "Red itchy rash on both forearms that appeared after contact with laundry detergent.",
    expectedSpecialty: 'Dermatologist',
    icon: 'Sparkles'
  },
  {
    title: 'Severe Acid Reflux & Bloating',
    query: "Burning feeling in upper stomach, severe acid reflux especially after dinner.",
    expectedSpecialty: 'Gastroenterologist',
    icon: 'Apple'
  },
  {
    title: 'Knee Joint Pain & Stiffness',
    query: "Sharp pain in right knee when bending down and morning joint stiffness.",
    expectedSpecialty: 'Orthopedist',
    icon: 'Bone'
  }
];
