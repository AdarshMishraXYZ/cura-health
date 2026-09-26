import { SymptomAnalysisResult } from '../types';
import { analyzeSymptomsWithLLMAgent } from './geminiAgentService';

export async function analyzeSymptomsWithAi(symptomsText: string): Promise<SymptomAnalysisResult> {
  // Delegate directly to the Agentic Clinical AI Engine
  return await analyzeSymptomsWithLLMAgent(symptomsText);
}
