import { ChatMessage } from '../types';
import { runAgenticChat } from './geminiAgentService';

export function getInitialChatMessages(): ChatMessage[] {
  return [
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: "Hello! 👋 I am your **Cura Clinical AI Assistant**.\n\nI can help you with:\n• **Symptom checks & specialist recommendations**\n• **Walking, joint & bone discomfort evaluation**\n• **Safe OTC medication suggestions & drug interactions**\n• **Lifestyle & preventive wellness advice**\n• **Intelligent doctor appointments**\n\nHow can I help you feel better today?",
      timestamp: 'Just now',
      options: [
        'Difficulty walking and foot pain',
        'Sore throat and mild fever since yesterday',
        'Persistent headache with light sensitivity for 3 days',
        'Is Paracetamol safe to take with other medicines?',
        'Severe acid reflux and stomach bloating'
      ]
    }
  ];
}

export async function processUserMessage(
  userText: string,
  chatHistory: ChatMessage[]
): Promise<ChatMessage[]> {
  // Delegate directly to the Agentic Clinical AI Engine
  return await runAgenticChat(userText, chatHistory);
}
