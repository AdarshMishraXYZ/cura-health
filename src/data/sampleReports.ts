import { MedicalReport } from '../types';

export const SAMPLE_REPORTS: MedicalReport[] = [
  {
    id: 'rep-1',
    fileName: 'Blood_Test_Report.pdf',
    fileSize: '240 KB',
    uploadDate: 'Today, 10:15 AM',
    category: 'Complete Blood & Vitamin Panel',
    overallSummary: 'Most hematological markers are within standard physiological reference ranges. However, Serum 25-Hydroxy Vitamin D level is significantly sub-optimal, indicating moderate insufficiency.',
    biomarkers: [
      {
        name: 'Hemoglobin',
        value: '13.8',
        unit: 'g/dL',
        status: 'normal',
        referenceRange: '13.0 - 17.5 g/dL',
        insight: 'Adequate red blood cell oxygen transport capacity.'
      },
      {
        name: 'Vitamin D',
        value: '18',
        unit: 'ng/mL',
        status: 'low',
        referenceRange: '30 - 100 ng/mL',
        insight: 'Deficiency/Insufficiency. Often associated with bone ache, fatigue, and low immunity.'
      },
      {
        name: 'Fasting glucose',
        value: '92',
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: '70 - 99 mg/dL',
        insight: 'Euglycemic healthy resting blood sugar.'
      },
      {
        name: 'Total Leukocytes (WBC)',
        value: '6.4',
        unit: 'x10³/µL',
        status: 'normal',
        referenceRange: '4.5 - 11.0 x10³/µL',
        insight: 'No active systemic infection detected.'
      }
    ],
    aiRecommendation: 'Vitamin D is below the normal range. Consider a follow-up with a general physician for cholecalciferol supplementation guidance.',
    recommendedSpecialty: 'general'
  },
  {
    id: 'rep-2',
    fileName: 'Advanced_Lipid_Profile.pdf',
    fileSize: '315 KB',
    uploadDate: 'Yesterday, 04:30 PM',
    category: 'Cardiovascular Risk Panel',
    overallSummary: 'Elevated Low-Density Lipoprotein (LDL) and Total Cholesterol. Atherogenic index warrants preventative cardiovascular evaluation.',
    biomarkers: [
      {
        name: 'Total Cholesterol',
        value: '228',
        unit: 'mg/dL',
        status: 'high',
        referenceRange: '< 200 mg/dL',
        insight: 'Borderline high risk for arterial plaque buildup.'
      },
      {
        name: 'LDL (Bad Cholesterol)',
        value: '154',
        unit: 'mg/dL',
        status: 'high',
        referenceRange: '< 100 mg/dL',
        insight: 'Above optimal target threshold.'
      },
      {
        name: 'HDL (Good Cholesterol)',
        value: '48',
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: '> 40 mg/dL',
        insight: 'Cardioprotective level within acceptable boundary.'
      },
      {
        name: 'Triglycerides',
        value: '145',
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: '< 150 mg/dL',
        insight: 'Normal fasting lipid clearance.'
      }
    ],
    aiRecommendation: 'Elevated LDL cholesterol identified. A consultation with a Cardiologist is recommended to discuss dietary modifications and cardiovascular risk stratification.',
    recommendedSpecialty: 'cardiologist'
  },
  {
    id: 'rep-3',
    fileName: 'Neuro_Thyroid_Screen.pdf',
    fileSize: '190 KB',
    uploadDate: '3 days ago',
    category: 'Endocrine & Neurological Baseline',
    overallSummary: 'Thyroid stimulating hormone (TSH) within normal limits. Electrolyte balance and serum ferritin healthy.',
    biomarkers: [
      {
        name: 'TSH (Thyroid Stimulating)',
        value: '2.1',
        unit: 'µIU/mL',
        status: 'normal',
        referenceRange: '0.4 - 4.2 µIU/mL',
        insight: 'Normal thyroid regulation.'
      },
      {
        name: 'Serum Magnesium',
        value: '2.2',
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: '1.7 - 2.4 mg/dL',
        insight: 'Optimal neuromuscular electrolyte balance.'
      },
      {
        name: 'Serum Ferritin',
        value: '75',
        unit: 'ng/mL',
        status: 'normal',
        referenceRange: '30 - 300 ng/mL',
        insight: 'Healthy intracellular iron stores.'
      }
    ],
    aiRecommendation: 'Routine biomarkers appear stable. If experiencing recurring migraines or focal nerve sensations, an appointment with a Neurologist is advised.',
    recommendedSpecialty: 'neurologist'
  }
];
