
// @ts-expect-error
/// <reference lib="deno.ns" />


import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
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
    
    const systemInstruction = "You are an expert marketing copywriter specializing in short, engaging WhatsApp messages. Generate a single, concise, and compelling message based on the user's prompt. Do not add any preamble or extra text. Only provide the message content.";

    const response = await ai.models.generateContent({
      model,
      // FIX: contents should be an array of parts with a text property
      contents: [{parts: [{text: prompt}]}],
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    // FIX: Access response text directly as per @google/genai guidelines.
    const message = response.text;

    return new Response(JSON.stringify({ message }), {
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