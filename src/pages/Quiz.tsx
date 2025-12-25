import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizCard } from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { subjects, Question } from '@/lib/data';
import { useSubjectQuestions } from '@/hooks/useQuestions';
import { ArrowLeft, Trophy, RotateCcw, Home, CheckCircle2, Bot, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export const Quiz: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { profile, addPoints, recordAnswer, earnBadge } = useStudent();
  const { data: dbQuestions = [], isLoading: questionsLoading } = useSubjectQuestions(subjectId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  
  const subject = subjects.find(s => s.id === subjectId);
  const useBangla = profile.medium === 'bangla';
  
  // Transform database questions to the format QuizCard expects
  const questions: Question[] = useMemo(() => {
    return dbQuestions.slice(0, 10).map(q => ({
      id: q.id,
      subjectId: q.subject_id,
      topicId: q.topic || 'general',
      question: q.question,
      questionBn: q.question_bangla || undefined,
      options: Array.isArray(q.options) ? q.options : [],
      optionsBn: undefined,
      correctAnswer: q.correct_answer,
      explanation: q.explanation || '',
      explanationBn: q.explanation_bangla || undefined,
      difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      points: q.difficulty === 'hard' ? 15 : q.difficulty === 'medium' ? 10 : 5,
    }));
  }, [dbQuestions]);

  // Get AI feedback when quiz completes
  useEffect(() => {
    if (isComplete && !aiFeedback && !loadingFeedback) {
      fetchAIFeedback();
    }
  }, [isComplete]);

  const fetchAIFeedback = async () => {
    setLoadingFeedback(true);
    try {
      // Determine weak and strong topics based on answers
      const topicResults: Record<string, { correct: number; total: number }> = {};
      questions.forEach((q, i) => {
        if (!topicResults[q.topicId]) {
          topicResults[q.topicId] = { correct: 0, total: 0 };
        }
        topicResults[q.topicId].total++;
        if (answers[i]) {
          topicResults[q.topicId].correct++;
        }
      });

      const weakTopics = Object.entries(topicResults)
        .filter(([_, r]) => r.correct / r.total < 0.5)
        .map(([topic]) => topic);
      
      const strongTopics = Object.entries(topicResults)
        .filter(([_, r]) => r.correct / r.total >= 0.8)
        .map(([topic]) => topic);

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: useBangla ? 'আমার কুইজের ফলাফল দেখে পরামর্শ দাও' : 'Give me feedback on my quiz results' }],
          type: 'quiz-feedback',
          quizResults: {
            subject: subject?.name || subjectId,
            score: answers.filter(Boolean).length,
            total: questions.length,
            weakTopics,
            strongTopics,
          }
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get AI feedback');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let feedbackText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              feedbackText += content;
              setAiFeedback(feedbackText);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('AI feedback error:', error);
      setAiFeedback(useBangla 
        ? 'দুঃখিত, AI পরামর্শ লোড করতে সমস্যা হয়েছে।' 
        : 'Sorry, could not load AI feedback.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleAnswer = (correct: boolean) => {
    const question = questions[currentIndex];
    const pointsEarned = correct ? question.points : 0;
    
    setAnswers(prev => [...prev, correct]);
    if (correct) {
      setScore(prev => prev + pointsEarned);
      addPoints(pointsEarned);
    }
    recordAnswer(correct, question.topicId);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        // Quiz complete
        setIsComplete(true);
        const totalCorrect = [...answers, correct].filter(Boolean).length;
        if (totalCorrect === questions.length) {
          earnBadge('perfect_quiz');
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setAnswers([]);
    setAiFeedback('');
  };

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button onClick={() => navigate('/subjects')}>
            Back to Subjects
          </Button>
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No questions available</h1>
          <p className="text-muted-foreground mb-4">Add questions via the Question Bank</p>
          <Button onClick={() => navigate('/question-bank')}>
            Go to Question Bank
          </Button>
        </div>
      </div>
    );
  }

  const correctCount = answers.filter(Boolean).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                'bg-gradient-to-br shadow-md',
                subject.color
              )}>
                {subject.icon}
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? subject.nameBn : subject.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {questions.length} questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {!isComplete ? (
          <QuizCard
            key={`question-${currentIndex}`}
            question={questions[currentIndex]}
            useBangla={useBangla}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
        ) : (
          /* Results */
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className={cn(
              'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
              percentage >= 80 ? 'bg-success/20 text-success' :
              percentage >= 50 ? 'bg-warning/20 text-warning' :
              'bg-destructive/20 text-destructive'
            )}>
              {percentage >= 80 ? (
                <Trophy className="w-12 h-12" />
              ) : (
                <CheckCircle2 className="w-12 h-12" />
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {percentage >= 80 ? 'Excellent! 🎉' :
               percentage >= 50 ? 'Good effort! 👍' :
               'Keep practicing! 💪'}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              You scored {correctCount} out of {questions.length} questions correctly
            </p>

            {/* Score circle */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text">{percentage}%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">+{score}</p>
                  <p className="text-sm text-muted-foreground">Points earned</p>
                </div>
              </div>
            </div>

            {/* Answer summary */}
            <div className="flex justify-center gap-2 mb-6">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                    correct ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* AI Feedback */}
            <div className="glass-card rounded-2xl p-5 mb-6 text-left bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {useBangla ? 'মাস্টার মশাই এর পরামর্শ' : 'Master Moshai\'s Advice'}
                  </h3>
                  <p className="text-xs text-muted-foreground">AI-powered feedback</p>
                </div>
              </div>
              
              {loadingFeedback ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{useBangla ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing your performance...'}</span>
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {aiFeedback}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRestart}
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>

            {/* Ask AI More */}
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate('/ai-chat')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {useBangla ? 'AI এর সাথে আরও আলোচনা করুন' : 'Discuss more with AI'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
