import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { triageLimiter } from '../middleware/rateLimiter.js';

export const triageRouter = Router();

const triageSchema = z.object({
  symptoms: z.string().min(3, 'Symptoms must be at least 3 characters').max(1000, 'Input too long'),
});

const CLINICAL_SYSTEM_PROMPT = `
You are the "Cura Clinical AI Orchestrator", an intelligent multi-agent healthcare triage assistant.
You possess deep medical clinical reasoning capabilities, empathy, and conversational fluency.

Analyze the user's symptoms and respond ONLY in valid JSON format.
RULES:
1. Reason carefully through anatomy, physiology, and pathology.
2. Accurately assign the best medical specialty ID from: 'orthopedist', 'neurologist', 'cardiologist', 'dermatologist', 'gastroenterologist', 'ent', 'gynecologist', 'pediatrician', or 'general'.
3. Assign clinical matchScore (70 - 99).
4. Assign urgencyLevel: 'routine', 'moderate', or 'high_attention'.
5. Provide clinical reasoning explaining why this specialty was matched.
6. Provide 3 evidence-based actionable next steps.
7. Recommend 2-3 safe Over-The-Counter (OTC) medicines or home remedies with dosages and precautions.
8. State whether an appointment should be booked.

JSON SCHEMA (Return STRICTLY valid JSON with no markdown formatting or extra text):
{
  "suggestedSpecialtyId": "string",
  "suggestedSpecialtyName": "string",
  "matchScore": number,
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
  "bookingPrompt": "string"
}
`;

// POST /api/triage - Secure Server-Side Gemini AI Symptom Triage Proxy
triageRouter.post('/', triageLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = triageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { symptoms } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable: Gemini API key not configured on server.',
      });
    }

    // Call Google Gemini 2.5 Flash via REST API
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${CLINICAL_SYSTEM_PROMPT}\n\nPATIENT SYMPTOMS:\n${symptoms}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    };

    const aiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('Gemini API upstream error:', errText);
      return res.status(502).json({ error: 'Upstream AI service error. Please try again.' });
    }

    const aiData = await aiResponse.json();
    const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'Empty response returned from clinical AI engine.' });
    }

    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);

    // Audit log this triage event to PostgreSQL
    try {
      await prisma.triageLog.create({
        data: {
          symptoms,
          specialtyId: result.suggestedSpecialtyId || 'general',
          matchScore: result.matchScore || 85,
          urgencyLevel: result.urgencyLevel || 'routine',
          clinicalReason: result.clinicalReasoning || '',
          ipAddress: req.ip || req.socket.remoteAddress || null,
        },
      });
    } catch (logErr) {
      console.warn('Could not record triage log:', logErr);
    }

    return res.json({ result });
  } catch (error) {
    console.error('Triage proxy error:', error);
    return res.status(500).json({ error: 'Internal server error while processing symptom triage.' });
  }
});
