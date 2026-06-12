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

    const body = await req.json();
    const { mode, subject, level, medium, question, answerText, imageBase64, imageMime } = body;

    const useBangla = medium === 'bangla';

    // ===== MODE 1: Generate a CQ question =====
    if (mode === 'generate') {
      const sysPrompt = `You are a Bangladesh ${level?.toUpperCase() || 'SSC'} board examiner. Generate ONE authentic Creative Question (CQ / সৃজনশীল প্রশ্ন) for the subject "${subject}".

Format STRICTLY as JSON:
{
  "stimulus": "<উদ্দীপক / stimulus paragraph 2-4 lines>",
  "parts": [
    { "label": "ক", "text": "<knowledge question, 1 mark>", "marks": 1 },
    { "label": "খ", "text": "<comprehension question, 2 marks>", "marks": 2 },
    { "label": "গ", "text": "<application question, 3 marks>", "marks": 3 },
    { "label": "ঘ", "text": "<higher-order question, 4 marks>", "marks": 4 }
  ],
  "totalMarks": 10
}

${useBangla ? 'Write everything in Bangla (Bengali script). Use Bangla numerals where natural.' : 'Write everything in English.'}
Return ONLY the JSON, no markdown fences.`;

      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: sysPrompt }, { role: "user", content: `Generate a CQ for ${subject}.` }],
        }),
      });
      if (!r.ok) throw new Error(`AI gateway ${r.status}`);
      const data = await r.json();
      const content = data.choices?.[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON');
      return new Response(match[0], { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== MODE 2: Evaluate (OCR if image provided) =====
    const sysPrompt = `You are a strict but fair Bangladesh board examiner evaluating a Creative Question (CQ) answer script.

The student's answer may be provided as typed text or as a photo of a handwritten answer script. If a photo is provided, FIRST perform OCR — carefully read the handwriting (which may be in Bangla or English) and extract the full text. Then evaluate it.

Return STRICT JSON only (no markdown):
{
  "ocrText": "<extracted text from image, or empty string if text was typed>",
  "totalScore": <number>,
  "maxScore": 10,
  "partScores": [
    { "label": "ক", "score": <0-1>, "max": 1, "feedback": "<short>" },
    { "label": "খ", "score": <0-2>, "max": 2, "feedback": "<short>" },
    { "label": "গ", "score": <0-3>, "max": 3, "feedback": "<short>" },
    { "label": "ঘ", "score": <0-4>, "max": 4, "feedback": "<short>" }
  ],
  "overallFeedback": "<2-3 sentences>",
  "strengths": ["<s1>", "<s2>"],
  "improvements": ["<i1>", "<i2>"],
  "modelAnswer": "<concise model answer covering all 4 parts>"
}

${useBangla ? 'All feedback text MUST be in Bangla.' : 'All feedback text in English.'}`;

    const userContent: any[] = [
      { type: "text", text: `Subject: ${subject}\nLevel: ${level}\n\nQUESTION:\n${question}\n\n${imageBase64 ? 'STUDENT ANSWER: (see attached photo of handwritten answer script — perform OCR then evaluate)' : `STUDENT ANSWER (typed):\n${answerText || ''}`}` }
    ];
    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${imageMime || 'image/jpeg'};base64,${imageBase64}` }
      });
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error('AI gateway error:', r.status, errText);
      throw new Error(`AI gateway ${r.status}`);
    }
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content || '';
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    return new Response(match[0], { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("cq-checker error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});