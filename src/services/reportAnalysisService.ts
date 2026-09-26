import { MedicalReport } from '../types';
import { SAMPLE_REPORTS } from '../data/sampleReports';

export async function parseMedicalReport(file: File): Promise<MedicalReport> {
  // Simulate AI Vision / Document extraction latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fileName = file.name;
  const fileSize = `${Math.round(file.size / 1024)} KB`;

  // If matching sample report name, return enhanced version
  const foundSample = SAMPLE_REPORTS.find(r => r.fileName.toLowerCase() === fileName.toLowerCase());
  if (foundSample) {
    return {
      ...foundSample,
      id: `uploaded-${Date.now()}`,
      uploadDate: 'Just now'
    };
  }

  // Generic dynamic parser for uploaded files
  const isLipid = fileName.toLowerCase().includes('lipid') || fileName.toLowerCase().includes('cholesterol');
  const isBlood = fileName.toLowerCase().includes('blood') || fileName.toLowerCase().includes('cbc');

  if (isLipid) {
    return {
      id: `uploaded-${Date.now()}`,
      fileName,
      fileSize,
      uploadDate: 'Just now',
      category: 'Lipid & Metabolic Profile',
      overallSummary: 'Analysis indicates elevated circulating lipid particles. LDL cholesterol is above the target reference limit.',
      biomarkers: [
        { name: 'Total Cholesterol', value: '235', unit: 'mg/dL', status: 'high', referenceRange: '< 200 mg/dL', insight: 'Elevated total serum cholesterol.' },
        { name: 'LDL Cholesterol', value: '158', unit: 'mg/dL', status: 'high', referenceRange: '< 100 mg/dL', insight: 'High atherogenic lipid fraction.' },
        { name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', status: 'normal', referenceRange: '> 40 mg/dL', insight: 'Cardioprotective levels normal.' },
        { name: 'Triglycerides', value: '142', unit: 'mg/dL', status: 'normal', referenceRange: '< 150 mg/dL', insight: 'Normal triglyceride storage.' }
      ],
      aiRecommendation: 'High LDL detected. Schedule a consultation with a Cardiologist for dietary guidance and cardiovascular health monitoring.',
      recommendedSpecialty: 'cardiologist'
    };
  }

  // Default parsed blood panel
  return {
    id: `uploaded-${Date.now()}`,
    fileName,
    fileSize,
    uploadDate: 'Just now',
    category: isBlood ? 'Complete Blood Count (CBC)' : 'Diagnostic Lab Report',
    overallSummary: 'OCR extracted 4 primary biomarkers. Overall panel is stable with low 25-OH Vitamin D requiring attention.',
    biomarkers: [
      { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', status: 'normal', referenceRange: '13.0 - 17.5 g/dL', insight: 'Normal oxygen-carrying capacity.' },
      { name: 'Vitamin D', value: '18', unit: 'ng/mL', status: 'low', referenceRange: '30 - 100 ng/mL', insight: 'Insufficient vitamin D levels.' },
      { name: 'Fasting glucose', value: '92', unit: 'mg/dL', status: 'normal', referenceRange: '70 - 99 mg/dL', insight: 'Healthy glucose homeostasis.' },
      { name: 'Platelet Count', value: '240', unit: 'x10³/µL', status: 'normal', referenceRange: '150 - 450 x10³/µL', insight: 'Adequate clotting capacity.' }
    ],
    aiRecommendation: 'Vitamin D is below the normal range. Consider a follow-up with a general physician.',
    recommendedSpecialty: 'general'
  };
}
