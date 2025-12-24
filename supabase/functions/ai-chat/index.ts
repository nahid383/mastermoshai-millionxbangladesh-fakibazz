import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { messages, type, quizResults } = await req.json();
    
    let systemPrompt = "";
    
    if (type === "quiz-feedback") {
      // AI feedback after quiz
      systemPrompt = `You are Master-Moshai (মাস্টার মশাই), an AI learning companion for Bangladeshi SSC and HSC students. 
      
You provide personalized feedback after quizzes. Based on the quiz results provided, you should:
1. Acknowledge what the student did well
2. Identify specific areas that need improvement
3. Provide 2-3 actionable study tips for the weak areas
4. Be encouraging and motivating

Keep your response concise (max 150 words). Use a friendly, supportive tone. You can mix Bengali and English naturally.

Quiz Results:
- Subject: ${quizResults?.subject || 'Unknown'}
- Score: ${quizResults?.score || 0}/${quizResults?.total || 0}
- Weak Topics: ${quizResults?.weakTopics?.join(', ') || 'None identified'}
- Strong Topics: ${quizResults?.strongTopics?.join(', ') || 'None identified'}`;
    } else {
      // General AI chat for study help
      systemPrompt = `You are Master-Moshai (মাস্টার মশাই), an AI learning companion for Bangladeshi SSC and HSC students.

You help students with:
- SSC (Secondary School Certificate) exam preparation
- HSC (Higher Secondary Certificate) exam preparation  
- University admission test preparation
- Explaining concepts in Physics, Chemistry, Biology, Math, English, Bangla, ICT
- Answering academic questions
- Study tips and exam strategies

Guidelines:
- Keep explanations clear and concise
- Use examples when helpful
- You can respond in Bengali or English based on user preference
- Be encouraging and supportive
- If unsure, admit it and suggest resources

Do not provide non-academic help or inappropriate content.`;
    }

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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("ai-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
