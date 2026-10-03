import { MedicalReport } from '../types';
import { getGeminiApiKey } from './geminiAgentService';

// ─── CLINICAL REPORT ANALYSIS PROMPT ─────────────────────────────────────────
// Instructs Gemini to ONLY report what it actually sees — no hallucination
const REPORT_ANALYSIS_PROMPT = `You are a clinical medical lab report analyzer with deep expertise in pathology and diagnostic medicine.

You have been given a lab report image or PDF. Your job is to:
1. READ the actual values, biomarkers, and reference ranges FROM THE REPORT ITSELF.
2. NEVER invent, guess, or assume values not clearly visible in the document.
3. Determine the ACTUAL test type from what you see (CBC, KFT, LFT, Lipid, Thyroid, etc.)
4. Classify each biomarker as normal/low/high/critical based on its reference range shown in the report.

STRICT RULES:
- DO NOT fabricate values you cannot read clearly. If unclear, say "Unable to read" in the insight.
- DO NOT assume it's a CBC just because you can't identify the test type. Look at the report carefully.
- Base your specialty recommendation ONLY on the actual abnormal findings you see.
- The overallSummary must describe THIS specific report, not a generic template.

Return ONLY valid raw JSON (no markdown, no backticks) matching this exact schema:
{
  "reportType": "string — exact test name you see in the report (e.g. KFT, CBC, LFT, Lipid Profile, HbA1c, Thyroid Profile, etc.)",
  "category": "string — full descriptive name (e.g. Kidney Function Test, Complete Blood Count)",
  "overallSummary": "string — 2-3 sentence clinical summary describing ONLY what you actually found in this specific report",
  "biomarkers": [
    {
      "name": "string — exact parameter name from the report",
      "value": "string — exact numeric value from the report",
      "unit": "string — unit from the report",
      "status": "normal" | "low" | "high" | "critical",
      "referenceRange": "string — reference range as printed in the report (or 'Not shown' if absent)",
      "insight": "string — brief clinical explanation of this specific value"
    }
  ],
  "aiRecommendation": "string — specific follow-up recommendation based on actual findings in THIS report",
  "recommendedSpecialty": "general" | "cardiologist" | "neurologist" | "gastroenterologist" | "dermatologist" | "gynecologist" | "pediatrician" | "orthopedist" | "ent"
}`;

// ─── READ FILE AS BASE64 ──────────────────────────────────────────────────────
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/jpeg;base64," prefix — keep only base64 string
      const base64 = result.split(',')[1];
      if (!base64) reject(new Error('Failed to read file as base64'));
      else resolve(base64);
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

// ─── GEMINI VISION API CALL ───────────────────────────────────────────────────
async function callGeminiVision(base64Data: string, mimeType: string, apiKey: string): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        { text: REPORT_ANALYSIS_PROMPT },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,        // Very low — we want factual extraction, not creative output
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Vision API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) throw new Error('Empty response from Gemini Vision.');

  // Strip any accidental markdown code fences
  const cleaned = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export async function parseMedicalReport(file: File): Promise<MedicalReport> {
  const apiKey = getGeminiApiKey();

  // ── No API Key: do NOT hallucinate fake data ──────────────────────────────
  if (!apiKey) {
    return {
      id: `no-key-${Date.now()}`,
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      uploadDate: 'Just now',
      category: 'Gemini API Key Required',
      overallSummary: '__NO_API_KEY__',
      biomarkers: [],
      aiRecommendation: 'Configure your Gemini API key to enable AI-powered report analysis.',
      recommendedSpecialty: 'general'
    };
  }

  // ── With API Key: send actual file to Gemini Vision ───────────────────────
  const base64Data = await readFileAsBase64(file);

  // Determine correct MIME type
  let mimeType = file.type;
  if (!mimeType || mimeType === 'application/octet-stream') {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') mimeType = 'application/pdf';
    else if (ext === 'png') mimeType = 'image/png';
    else mimeType = 'image/jpeg';
  }

  try {
    const result = await callGeminiVision(base64Data, mimeType, apiKey);

    // Validate that Gemini returned real data
    if (!result.biomarkers || result.biomarkers.length === 0) {
      throw new Error('Gemini could not extract biomarkers from this file. Please upload a clearer image or PDF.');
    }

    return {
      id: `uploaded-${Date.now()}`,
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      uploadDate: 'Just now',
      category: result.category || result.reportType || 'Medical Lab Report',
      overallSummary: result.overallSummary || 'Analysis complete.',
      biomarkers: result.biomarkers,
      aiRecommendation: result.aiRecommendation || 'Please consult your physician to review these results.',
      recommendedSpecialty: result.recommendedSpecialty || 'general'
    };
  } catch (err: any) {
    // Propagate real error — do NOT silently fall back to fake data
    throw new Error(
      err?.message?.includes('Gemini')
        ? err.message
        : `Report analysis failed: ${err?.message || 'Unknown error'}. Please try uploading a clearer image or check your API key.`
    );
  }
}
