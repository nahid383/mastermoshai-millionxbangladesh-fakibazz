import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const { messages, moodLevel, moodLabel, isInitial } = await req.json();
    
    const systemPrompt = `You are a compassionate mental health support companion for Bangladeshi students preparing for SSC, HSC, and university admission exams.

Greeting: Always start with "Assalamu Alaikum" (or আসসালামু আলাইকুম in Bangla).

Your role:
- Provide emotional support for exam anxiety and stress
- Offer practical relaxation techniques (breathing exercises, mindfulness)
- Share study tips to reduce overwhelm
- Be empathetic and understanding
- Encourage healthy habits (sleep, breaks, exercise)

${isInitial ? `The student's current mood level is ${moodLevel}/10 (${moodLabel}). Start by acknowledging their feelings warmly.` : ''}

Guidelines:
- Keep responses warm, supportive, and concise
- Mix Bengali and English naturally if the student uses Bengali
- Never give medical advice - suggest professional help for serious concerns
- Focus on practical, actionable coping strategies
- Remind them that exam stress is normal and manageable

IMPORTANT: This is NOT a replacement for professional mental health care. For emergencies, recommend calling 16789 (Bangladesh mental health helpline).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429 || status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("mental-support error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
