
// @ts-expect-error
/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// Note: You may need to create a Supabase client inside the function
// to insert messages into your database.
// import { createClient } from 'npm:@supabase/supabase-js';

console.log(`Function "whatsapp-webhook" up and running!`);

serve(async (req) => {
  // FIX: Suppress TypeScript error. The Deno global is available in the
  // Supabase Edge Function runtime, but may not be in the type-checking environment.
  // @ts-expect-error
  const verifyToken = Deno.env.get('META_VERIFY_TOKEN');

  if (req.method === 'GET') {
    // Handle the webhook verification request from Meta
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      return new Response(challenge, { status: 200 });
    } else {
      console.error('Webhook verification failed.');
      return new Response('Forbidden', { status: 403 });
    }
  }

  if (req.method === 'POST') {
    // Handle incoming message notifications
    try {
      const payload = await req.json();
      console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

      //
      // TODO: Add your logic here to process the message.
      // - Parse the payload to get the sender's number and message text.
      // - Create a Supabase client.
      // - Insert the new message into your 'messages' table.
      //

      return new Response(JSON.stringify({ status: 'success' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(JSON.stringify({ error: 'Failed to process payload' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  // Handle other methods
  return new Response('Method Not Allowed', { status: 405 });
});