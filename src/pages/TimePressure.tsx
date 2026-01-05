import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleQuestions } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, AlertTriangle, CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestMode = 'quick' | 'standard' | 'marathon';

interface TestConfig {
  mode: TestMode;
  name: string;
  nameBn: string;
  questions: number;
  timePerQuestion: number; // seconds
  description: string;
  descriptionBn: string;
  icon: string;
}

const testConfigs: TestConfig[] = [
  {
    mode: 'quick',
    name: 'Quick Fire',
    nameBn: 'দ্রুত আগুন',
    questions: 10,
    timePerQuestion: 30,
    description: '30 seconds per question. Test your speed!',
    descriptionBn: 'প্রতি প্রশ্নে ৩০ সেকেন্ড। তোমার গতি পরীক্ষা করো!',
    icon: '⚡',
  },
  {
    mode: 'standard',
    name: 'Standard Test',
    nameBn: 'স্ট্যান্ডার্ড টেস্ট',
    questions: 25,
    timePerQuestion: 60,
    description: '1 minute per question. Like real exams.',
    descriptionBn: 'প্রতি প্রশ্নে ১ মিনিট। আসল পরীক্ষার মতো।',
    icon: '📝',
  },
  {
    mode: 'marathon',
    name: 'Marathon',
    nameBn: 'ম্যারাথন',
    questions: 50,
    timePerQuestion: 45,
    description: '45 seconds per question. Full endurance test!',
    descriptionBn: 'প্রতি প্রশ্নে ৪৫ সেকেন্ড। পূর্ণ সহনশীলতা পরীক্ষা!',
    icon: '🏃',
  },
];

export const TimePressure: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');
  
  const [selectedMode, setSelectedMode] = useState<TestConfig | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [testQuestions, setTestQuestions] = useState<typeof sampleQuestions>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startTest = useCallback(() => {
    if (!selectedMode || !selectedSubject) return;
    
    // Get questions for subject
    const subjectQuestions = sampleQuestions.filter(q => q.subjectId === selectedSubject);
    const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, selectedMode.questions);
    
    // If not enough questions, fill with random ones
    while (selected.length < selectedMode.questions && sampleQuestions.length > 0) {
      const randomQ = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      if (!selected.find(q => q.id === randomQ.id)) {
        selected.push(randomQ);
      }
    }
    
    setTestQuestions(selected);
    setAnswers(new Array(selected.length).fill(null));
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(selectedMode.timePerQuestion);
    setIsTestActive(true);
    setIsComplete(false);
    setSelectedAnswer(null);
  }, [selectedMode, selectedSubject]);

  // Timer
  useEffect(() => {
    if (!isTestActive || isComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext(null); // Time up, move to next
          return selectedMode?.timePerQuestion || 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTestActive, isComplete, currentQuestion, selectedMode]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === testQuestions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    // Auto-advance after 1 second
    setTimeout(() => handleNext(answerIndex), 1000);
  };

  const handleNext = (answer: number | null) => {
    if (currentQuestion >= testQuestions.length - 1) {
      setIsComplete(true);
      setIsTestActive(false);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(selectedMode?.timePerQuestion || 30);
      setSelectedAnswer(null);
    }
  };

  const getTimeColor = () => {
    const threshold = (selectedMode?.timePerQuestion || 30) * 0.3;
    if (timeLeft <= threshold) return 'text-destructive';
    if (timeLeft <= threshold * 2) return 'text-warning';
    return 'text-primary';
  };

  if (isComplete) {
    const accuracy = Math.round((score / testQuestions.length) * 100);
    const xpEarned = score * 15;
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-6">
          <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {useBangla ? 'পরীক্ষা শেষ!' : 'Test Complete!'}
            </h1>
            
            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="p-4 rounded-xl bg-primary/10">
                <p className="text-3xl font-bold text-primary">{score}/{testQuestions.length}</p>
                <p className="text-sm text-muted-foreground">{useBangla ? 'সঠিক' : 'Correct'}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/10">
                <p className="text-3xl font-bold text-accent">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">{useBangla ? 'নির্ভুলতা' : 'Accuracy'}</p>
              </div>
              <div className="p-4 rounded-xl bg-success/10">
                <p className="text-3xl font-bold text-success">+{xpEarned}</p>
                <p className="text-sm text-muted-foreground">XP</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => {
                setIsComplete(false);
                setSelectedMode(null);
                setSelectedSubject(null);
              }}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {useBangla ? 'নতুন টেস্ট' : 'New Test'}
              </Button>
              <Button variant="hero" onClick={() => navigate('/dashboard')}>
                <Trophy className="w-4 h-4 mr-2" />
                {useBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isTestActive && testQuestions.length > 0) {
    const question = testQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
    
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
          <div className="container max-w-4xl mx-auto">
            {/* Progress */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1}/{testQuestions.length}
              </span>
              <div className={cn("flex items-center gap-2 font-bold text-xl", getTimeColor())}>
                <Clock className="w-5 h-5" />
                {timeLeft}s
              </div>
              <span className="text-sm text-muted-foreground">
                {useBangla ? 'স্কোর' : 'Score'}: {score}
              </span>
            </div>
          </div>
        </div>
        
        <main className="container max-w-4xl mx-auto px-4 py-6">
          <div className="glass-card rounded-2xl p-6 mb-6">
            <p className="text-lg font-medium text-foreground mb-6">
              {useBangla && question.questionBn ? question.questionBn : question.question}
            </p>
            
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = question.correctAnswer === index;
                const showResult = selectedAnswer !== null;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                      !showResult && "hover:border-primary hover:bg-primary/5",
                      showResult && isCorrect && "border-success bg-success/10",
                      showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                      !showResult && "border-border bg-card"
                    )}
                  >
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      showResult && isCorrect ? "bg-success text-white" :
                      showResult && isSelected ? "bg-destructive text-white" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {showResult && isCorrect ? <CheckCircle className="w-5 h-5" /> :
                       showResult && isSelected ? <XCircle className="w-5 h-5" /> :
                       String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-foreground">
                      {useBangla && question.optionsBn ? question.optionsBn[index] : option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-warning/10 to-destructive/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'সময়ের চাপে প্রশিক্ষণ' : 'Time Pressure Training'}
              </h1>
              <p className="text-muted-foreground">
                {useBangla ? 'পরীক্ষার মতো সময়ে অনুশীলন' : 'Practice under exam-like time pressure'}
              </p>
            </div>
          </div>
        </div>

        {!selectedMode ? (
          /* Mode Selection */
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {useBangla ? 'মোড বেছে নাও' : 'Choose Mode'}
            </h2>
            {testConfigs.map((config) => (
              <button
                key={config.mode}
                onClick={() => setSelectedMode(config)}
                className="w-full glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary transition-all text-left"
              >
                <span className="text-3xl">{config.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {useBangla ? config.nameBn : config.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useBangla ? config.descriptionBn : config.description}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{config.questions} questions</span>
                    <span>{config.timePerQuestion}s each</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : !selectedSubject ? (
          /* Subject Selection */
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setSelectedMode(null)}>
              ← {useBangla ? 'মোড পরিবর্তন' : 'Change Mode'}
            </Button>
            
            <h2 className="text-lg font-semibold text-foreground">
              {useBangla ? 'বিষয় বেছে নাও' : 'Choose Subject'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className="glass-card rounded-xl p-5 hover:border-primary transition-all"
                >
                  <span className="text-3xl mb-2 block">{subject.icon}</span>
                  <h3 className="font-semibold text-foreground">
                    {useBangla ? subject.nameBn : subject.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Ready to Start */
          <div className="text-center">
            <Button variant="ghost" onClick={() => setSelectedSubject(null)} className="mb-4">
              ← {useBangla ? 'বিষয় পরিবর্তন' : 'Change Subject'}
            </Button>
            
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
              <span className="text-5xl block mb-4">{selectedMode.icon}</span>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {useBangla ? 'প্রস্তুত?' : 'Ready?'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {selectedMode.questions} {useBangla ? 'টি প্রশ্ন' : 'questions'} • 
                {selectedMode.timePerQuestion}s {useBangla ? 'প্রতি প্রশ্নে' : 'per question'}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-6 text-warning">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">
                  {useBangla ? 'সময় শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তী প্রশ্নে যাবে' : 'Auto-advances when time runs out'}
                </span>
              </div>
              
              <Button variant="hero" size="lg" onClick={startTest} className="w-full">
                <Zap className="w-5 h-5" />
                {useBangla ? 'টেস্ট শুরু করো' : 'Start Test'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
