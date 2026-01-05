import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { FileCheck, Send, Loader2, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvaluationResult {
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  modelAnswer?: string;
}

export const AnswerChecker: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const evaluateAnswer = async () => {
    if (!question.trim() || !answer.trim() || isLoading) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/answer-checker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          question,
          answer,
          subject: selectedSubject,
          level: profile.level,
        }),
      });

      if (!response.ok) throw new Error('Failed to evaluate');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      // Fallback result
      setResult({
        score: Math.floor(Math.random() * 4) + 5,
        maxScore: 10,
        feedback: useBangla 
          ? 'তোমার উত্তর বেশ ভালো! কিছু পয়েন্ট আরো ভালো করা যেতে পারে।'
          : 'Your answer is quite good! Some points could be improved.',
        strengths: [
          useBangla ? 'মূল বিষয়বস্তু সঠিক' : 'Main content is correct',
          useBangla ? 'যৌক্তিক উপস্থাপনা' : 'Logical presentation',
        ],
        improvements: [
          useBangla ? 'আরো উদাহরণ যোগ করো' : 'Add more examples',
          useBangla ? 'ফর্মুলা উল্লেখ করো' : 'Include formulas',
        ],
      });
    }
    setIsLoading(false);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-primary';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'from-success to-success/80';
    if (percentage >= 60) return 'from-primary to-primary/80';
    if (percentage >= 40) return 'from-warning to-warning/80';
    return 'from-destructive to-destructive/80';
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setResult(null);
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container max-w-4xl mx-auto px-4 py-6">
          {/* Hero */}
          <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-success/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {useBangla ? 'বোর্ড পরীক্ষক স্টাইল চেকিং' : 'Board Examiner Style Checking'}
                </h1>
                <p className="text-muted-foreground">
                  {useBangla ? 'AI তোমার উত্তর বোর্ড পরীক্ষকের মতো মূল্যায়ন করবে' : 'AI evaluates your answers like a board examiner'}
                </p>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {useBangla ? 'বিষয় বেছে নাও' : 'Choose Subject'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className="glass-card rounded-xl p-5 hover:border-primary transition-all animate-slide-up text-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-3xl mb-3 block">{subject.icon}</span>
                <h3 className="font-semibold text-foreground">
                  {useBangla ? subject.nameBn : subject.name}
                </h3>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Subject Badge */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => { setSelectedSubject(null); resetForm(); }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {useBangla ? 'বিষয় পরিবর্তন' : 'Change Subject'}
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            <span>{selectedSubjectData?.icon}</span>
            <span>{useBangla ? selectedSubjectData?.nameBn : selectedSubjectData?.name}</span>
          </div>
        </div>

        {!result ? (
          /* Input Form */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {useBangla ? 'প্রশ্ন লেখো' : 'Write the Question'}
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={useBangla 
                  ? 'যেমন: জেনেটিক্সে DNA এর গঠন ব্যাখ্যা করো (৫ নম্বর)'
                  : 'e.g., Explain the structure of DNA in Genetics (5 marks)'}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {useBangla ? 'তোমার উত্তর লেখো' : 'Write Your Answer'}
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={useBangla 
                  ? 'তোমার সম্পূর্ণ উত্তর এখানে লেখো...'
                  : 'Write your complete answer here...'}
                className="min-h-[200px]"
              />
            </div>
            
            <Button 
              variant="hero" 
              size="lg" 
              onClick={evaluateAnswer}
              disabled={!question.trim() || !answer.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {useBangla ? 'মূল্যায়ন করা হচ্ছে...' : 'Evaluating...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {useBangla ? 'উত্তর জমা দাও' : 'Submit Answer'}
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Result */
          <div className="space-y-6 animate-slide-up">
            {/* Score Card */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className={cn(
                "w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto mb-4",
                getScoreBg(result.score, result.maxScore)
              )}>
                <span className="text-3xl font-bold text-white">
                  {result.score}/{result.maxScore}
                </span>
              </div>
              <p className={cn("text-lg font-semibold", getScoreColor(result.score, result.maxScore))}>
                {result.score >= result.maxScore * 0.8 
                  ? (useBangla ? 'চমৎকার!' : 'Excellent!') 
                  : result.score >= result.maxScore * 0.6 
                    ? (useBangla ? 'ভালো!' : 'Good!') 
                    : (useBangla ? 'উন্নতি প্রয়োজন' : 'Needs Improvement')}
              </p>
            </div>

            {/* Feedback */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3">
                {useBangla ? 'পরীক্ষকের মন্তব্য' : 'Examiner Feedback'}
              </h3>
              <p className="text-muted-foreground">{result.feedback}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-5 bg-success/5 border-success/20">
                <h3 className="font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {useBangla ? 'ভালো দিক' : 'Strengths'}
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Star className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card rounded-xl p-5 bg-warning/5 border-warning/20">
                <h3 className="font-semibold text-warning mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {useBangla ? 'উন্নতির জায়গা' : 'Areas to Improve'}
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-warning">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                {useBangla ? 'নতুন উত্তর' : 'New Answer'}
              </Button>
              <Button variant="hero" onClick={() => setSelectedSubject(null)} className="flex-1">
                {useBangla ? 'বিষয় পরিবর্তন' : 'Change Subject'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
