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
    const { profile, subjects, weeklyHours } = await req.json();
    
    // Generate a simple study plan without AI for reliability
    const plan = [];
    const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const isFriday = i === 6;
      
      plan.push({
        date: date.toLocaleDateString(),
        dayName: daysOfWeek[i],
        blocks: isFriday ? [] : subjects.slice(0, 3).map((s: any, idx: number) => ({
          id: `${i}-${idx}`,
          subject: s.name,
          subjectIcon: '📚',
          topic: s.topics?.[0] || 'General',
          duration: 45,
          type: idx === 0 ? 'revision' : idx === 1 ? 'practice' : 'new-topic',
          priority: idx === 0 ? 'high' : 'medium',
        })),
        totalHours: isFriday ? 0 : 2.25,
      });
    }
    
    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-study-planner error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate plan" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
