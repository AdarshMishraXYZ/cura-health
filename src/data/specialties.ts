import { Specialty } from '../types';

export const SPECIALTIES: Specialty[] = [
  {
    id: 'general',
    name: 'General physician',
    iconName: 'Stethoscope',
    doctorCount: 8,
    description: 'Primary care, fever, common infections, routine health checkups and preventive medicine.',
    commonSymptoms: ['Fever', 'Fatigue', 'Cough', 'Cold', 'General malaise', 'Body ache']
  },
  {
    id: 'cardiologist',
    name: 'Cardiologist',
    iconName: 'HeartPulse',
    doctorCount: 5,
    description: 'Heart health, hypertension, arrhythmias, chest discomfort, and cardiovascular diagnostics.',
    commonSymptoms: ['Chest tightness', 'Palpitations', 'Shortness of breath', 'High blood pressure', 'Dizziness']
  },
  {
    id: 'neurologist',
    name: 'Neurologist',
    iconName: 'Brain',
    doctorCount: 4,
    description: 'Brain, spinal cord, nerves, migraines, seizures, vertigo, and chronic nerve conditions.',
    commonSymptoms: ['Persistent headache', 'Light sensitivity', 'Numbness', 'Tremors', 'Memory issues', 'Migraine']
  },
  {
    id: 'gynecologist',
    name: 'Gynecologist',
    iconName: 'Activity',
    doctorCount: 6,
    description: 'Women’s reproductive wellness, maternal health, hormonal balance, and pelvic health.',
    commonSymptoms: ['Irregular cycles', 'Pelvic pain', 'Hormonal swings', 'Prenatal screening', 'PCOS']
  },
  {
    id: 'pediatrician',
    name: 'Pediatrician',
    iconName: 'Baby',
    doctorCount: 7,
    description: 'Infant, child, and adolescent healthcare, immunizations, and developmental tracking.',
    commonSymptoms: ['Child fever', 'Growth checkups', 'Pediatric allergy', 'Vaccinations', 'Teething']
  },
  {
    id: 'dermatologist',
    name: 'Dermatologist',
    iconName: 'Sparkles',
    doctorCount: 6,
    description: 'Skin, hair, nail disorders, eczema, acne, dermatitis, and mole evaluations.',
    commonSymptoms: ['Skin rash', 'Acne flareup', 'Unusual moles', 'Hair loss', 'Severe itching', 'Dry patches']
  },
  {
    id: 'orthopedist',
    name: 'Orthopedist',
    iconName: 'Bone',
    doctorCount: 4,
    description: 'Bones, joints, ligaments, sports injuries, fractures, and chronic arthritis care.',
    commonSymptoms: ['Joint pain', 'Back ache', 'Knee stiffness', 'Sprain', 'Fracture follow-up']
  },
  {
    id: 'ent',
    name: 'ENT specialist',
    iconName: 'Headphones',
    doctorCount: 5,
    description: 'Ear, nose, throat disorders, sinusitis, hearing concerns, tonsillitis, and vocal cords.',
    commonSymptoms: ['Sore throat', 'Sinus pressure', 'Ear ringing', 'Nasal blockage', 'Hoarseness']
  },
  {
    id: 'gastroenterologist',
    name: 'Gastroenterologist',
    iconName: 'Apple',
    doctorCount: 3,
    description: 'Digestive tract, acid reflux, stomach ulcers, liver health, and bowel irregularities.',
    commonSymptoms: ['Stomach acidity', 'Abdominal cramps', 'Bloating', 'Indigestion', 'Nausea']
  },
  {
    id: 'psychiatrist',
    name: 'Psychiatrist',
    iconName: 'Smile',
    doctorCount: 4,
    description: 'Mental health, anxiety disorders, sleep disturbances, depression, and therapy guidance.',
    commonSymptoms: ['Anxiety', 'Insomnia', 'Chronic stress', 'Panic attacks', 'Depressed mood']
  }
];
