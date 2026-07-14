import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'no-reply@your-verified-domain.com'; // IMPORTANT: Replace with your verified domain in Resend

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, from } = await req.json();
    if (!to || !subject || !html) {
      throw new Error("Missing required fields: 'to', 'subject', 'html'");
    }

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || DEFAULT_FROM,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Resend API Error:", errorBody);
      throw new Error(errorBody.message || 'Failed to send email.');
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});