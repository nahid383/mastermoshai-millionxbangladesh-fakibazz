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

    const { question, answer, subject, level } = await req.json();
    
    const systemPrompt = `You are a Board Examiner for Bangladesh ${level?.toUpperCase() || 'SSC/HSC'} exams, evaluating student answers.

Evaluate the following answer like a real board examiner would. Be fair but strict.

Return a JSON response with:
{
  "score": <number 0-10>,
  "maxScore": 10,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Evaluation criteria:
- Accuracy of content
- Completeness of answer
- Proper structure and organization
- Use of relevant examples/formulas
- Language and presentation`;

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
          { role: "user", content: `Subject: ${subject}\n\nQuestion: ${question}\n\nStudent's Answer: ${answer}` },
        ],
      }),
    });

    if (!response.ok) throw new Error("AI gateway error");

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("answer-checker error:", error);
    return new Response(JSON.stringify({ 
      score: 5, 
      maxScore: 10, 
      feedback: "Unable to evaluate at this moment.",
      strengths: ["Answer submitted"],
      improvements: ["Try again later"]
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
