import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { Calendar, Clock, Target, Sparkles, RefreshCw, CheckCircle, BookOpen, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudyBlock {
  id: string;
  subject: string;
  subjectIcon: string;
  topic: string;
  duration: number; // minutes
  type: 'revision' | 'practice' | 'new-topic' | 'break';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface DayPlan {
  date: string;
  dayName: string;
  blocks: StudyBlock[];
  totalHours: number;
}

export const StudyPlanner: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  
  const weeklyHours = 20;
  const daysOfWeek = useBangla 
    ? ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার']
    : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const generateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('ai-study-planner', {
        body: {
          profile: {
            level: profile.level,
            weakTopics: profile.weakTopics,
            strongTopics: profile.strongTopics,
            targetUniversity: profile.targetUniversity,
            examDate: profile.examDate,
          },
          subjects: subjects.map(s => ({ id: s.id, name: s.name, topics: s.topics.map(t => t.name) })),
          weeklyHours,
        }
      });

      if (response.error) throw response.error;
      
      // Parse AI response and create plan
      const plan = createPlanFromAI(response.data);
      setWeeklyPlan(plan);
      toast.success(useBangla ? 'স্টাডি প্ল্যান তৈরি হয়েছে!' : 'Study plan generated!');
    } catch (error) {
      console.error('Failed to generate plan:', error);
      // Fallback to local generation
      const plan = generateLocalPlan();
      setWeeklyPlan(plan);
      toast.success(useBangla ? 'স্টাডি প্ল্যান তৈরি হয়েছে!' : 'Study plan generated!');
    }
    setIsGenerating(false);
  };

  const generateLocalPlan = (): DayPlan[] => {
    const plan: DayPlan[] = [];
    const hoursPerDay = weeklyHours / 6; // 6 study days
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const isFriday = i === 6;
      
      const blocks: StudyBlock[] = [];
      
      if (!isFriday) {
        // Morning session - Focus on weak topics
        const weakSubjects = subjects.filter(s => 
          s.topics.some(t => profile.weakTopics.includes(t.name))
        );
        
        if (weakSubjects.length > 0) {
          const subj = weakSubjects[i % weakSubjects.length];
          const weakTopic = subj.topics.find(t => profile.weakTopics.includes(t.name)) || subj.topics[0];
          blocks.push({
            id: `${i}-1`,
            subject: useBangla ? subj.nameBn : subj.name,
            subjectIcon: subj.icon,
            topic: useBangla ? weakTopic.nameBn : weakTopic.name,
            duration: 45,
            type: 'revision',
            priority: 'high',
          });
        }
        
        // Break
        blocks.push({
          id: `${i}-break-1`,
          subject: useBangla ? 'বিরতি' : 'Break',
          subjectIcon: '☕',
          topic: useBangla ? 'আরাম করো' : 'Relax & refresh',
          duration: 15,
          type: 'break',
          priority: 'low',
        });
        
        // Afternoon - Practice
        const practiceSubj = subjects[(i + 1) % subjects.length];
        blocks.push({
          id: `${i}-2`,
          subject: useBangla ? practiceSubj.nameBn : practiceSubj.name,
          subjectIcon: practiceSubj.icon,
          topic: useBangla ? practiceSubj.topics[0].nameBn : practiceSubj.topics[0].name,
          duration: 60,
          type: 'practice',
          priority: 'medium',
        });
        
        // Evening - New topic
        const newSubj = subjects[(i + 2) % subjects.length];
        const newTopic = newSubj.topics[Math.floor(Math.random() * newSubj.topics.length)];
        blocks.push({
          id: `${i}-3`,
          subject: useBangla ? newSubj.nameBn : newSubj.name,
          subjectIcon: newSubj.icon,
          topic: useBangla ? newTopic.nameBn : newTopic.name,
          duration: 45,
          type: 'new-topic',
          priority: 'medium',
        });
      }
      
      plan.push({
        date: date.toLocaleDateString(),
        dayName: daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1] || daysOfWeek[i],
        blocks,
        totalHours: blocks.reduce((sum, b) => sum + b.duration, 0) / 60,
      });
    }
    
    return plan;
  };

  const createPlanFromAI = (aiResponse: any): DayPlan[] => {
    // If AI returns structured data, use it; otherwise use local generation
    if (aiResponse?.plan && Array.isArray(aiResponse.plan)) {
      return aiResponse.plan;
    }
    return generateLocalPlan();
  };

  const toggleBlockComplete = (blockId: string) => {
    setCompletedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  const getBlockStyle = (type: StudyBlock['type']) => {
    switch (type) {
      case 'revision': return 'border-destructive/30 bg-destructive/5';
      case 'practice': return 'border-primary/30 bg-primary/5';
      case 'new-topic': return 'border-accent/30 bg-accent/5';
      case 'break': return 'border-muted bg-muted/50';
      default: return 'border-border bg-card';
    }
  };

  const getBlockIcon = (type: StudyBlock['type']) => {
    switch (type) {
      case 'revision': return <RefreshCw className="w-4 h-4 text-destructive" />;
      case 'practice': return <Target className="w-4 h-4 text-primary" />;
      case 'new-topic': return <Brain className="w-4 h-4 text-accent" />;
      case 'break': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'AI স্টাডি প্ল্যানার' : 'AI Study Planner'}
              </h1>
              <p className="text-muted-foreground">
                {useBangla ? 'তোমার জন্য ব্যক্তিগত রুটিন' : 'Personalized study routine for you'}
              </p>
            </div>
          </div>
          
          {weeklyPlan.length === 0 ? (
            <Button 
              variant="hero" 
              onClick={generateAIPlan}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {useBangla ? 'প্ল্যান তৈরি হচ্ছে...' : 'Generating plan...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {useBangla ? 'AI দিয়ে প্ল্যান তৈরি করো' : 'Generate AI Study Plan'}
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={generateAIPlan}
              disabled={isGenerating}
              size="sm"
            >
              <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
              {useBangla ? 'নতুন প্ল্যান' : 'New Plan'}
            </Button>
          )}
        </div>

        {weeklyPlan.length > 0 && (
          <>
            {/* Day Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {weeklyPlan.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex-shrink-0 px-4 py-3 rounded-xl border transition-all",
                    selectedDay === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <p className="font-semibold text-sm">{day.dayName}</p>
                  <p className="text-xs text-muted-foreground">{day.totalHours.toFixed(1)}h</p>
                </button>
              ))}
            </div>

            {/* Today's Plan */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {weeklyPlan[selectedDay]?.dayName} {useBangla ? 'এর রুটিন' : 'Schedule'}
              </h2>
              
              {weeklyPlan[selectedDay]?.blocks.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-semibold text-foreground">
                    {useBangla ? 'আজ ছুটির দিন!' : 'Rest Day!'}
                  </h3>
                  <p className="text-muted-foreground">
                    {useBangla ? 'আরাম করো এবং পরের দিনের জন্য প্রস্তুত হও' : 'Relax and prepare for tomorrow'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyPlan[selectedDay]?.blocks.map((block) => {
                    const isCompleted = completedBlocks.has(block.id);
                    return (
                      <button
                        key={block.id}
                        onClick={() => toggleBlockComplete(block.id)}
                        className={cn(
                          "w-full p-4 rounded-xl border transition-all flex items-center gap-4",
                          getBlockStyle(block.type),
                          isCompleted && "opacity-60 line-through"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                          block.type === 'break' ? 'bg-muted' : 'bg-card'
                        )}>
                          {block.subjectIcon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            {getBlockIcon(block.type)}
                            <h3 className="font-semibold text-foreground">{block.subject}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{block.topic}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{block.duration}m</span>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-success" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Progress Summary */}
            <div className="mt-6 glass-card rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">
                {useBangla ? 'আজকের অগ্রগতি' : "Today's Progress"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-success transition-all"
                    style={{ 
                      width: `${(Array.from(completedBlocks).filter(id => 
                        weeklyPlan[selectedDay]?.blocks.some(b => b.id === id)
                      ).length / Math.max(weeklyPlan[selectedDay]?.blocks.length || 1, 1)) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {Array.from(completedBlocks).filter(id => 
                    weeklyPlan[selectedDay]?.blocks.some(b => b.id === id)
                  ).length}/{weeklyPlan[selectedDay]?.blocks.length || 0}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
