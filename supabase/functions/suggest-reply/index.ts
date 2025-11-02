
// @ts-expect-error
/// <reference lib="deno.ns" />


import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';

interface Message {
  text: string;
  sender: 'me' | 'customer';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { conversation } = await req.json() as { conversation: Message[] };
    // Deno.env.get is available in Supabase Edge Functions runtime.
    // FIX: Suppress TypeScript error. The Deno global is available in the
    // Supabase Edge Function runtime, but may not be in the type-checking environment.
    // @ts-expect-error
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    
    const formattedConversation = conversation
      .slice(-5) // Get last 5 messages
      .map(msg => `${msg.sender === 'me' ? 'Support' : 'Customer'}: ${msg.text}`)
      .join('\n');
      
    const prompt = `
      Based on the following WhatsApp conversation, suggest a helpful and concise reply from the 'Support' perspective.
      The goal is to be friendly and resolve the customer's query efficiently.
      
      Conversation:
      ${formattedConversation}

      Suggested Reply:
    `;

    const systemInstruction = "You are a helpful customer support assistant. Your goal is to provide short, relevant, and friendly reply suggestions for WhatsApp conversations. Only provide the reply text, no extra formatting or explanations.";
    
    const response = await ai.models.generateContent({
      model,
      // FIX: contents should be an array of parts with a text property
      contents: [{parts: [{text: prompt}]}],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // FIX: Access response text directly as per @google/genai guidelines.
    const suggestion = response.text;

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});