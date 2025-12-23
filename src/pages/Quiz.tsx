import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizCard } from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { subjects, sampleQuestions } from '@/lib/data';
import { ArrowLeft, Trophy, RotateCcw, Home, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Quiz: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { profile, addPoints, recordAnswer, earnBadge } = useStudent();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  
  const subject = subjects.find(s => s.id === subjectId);
  const useBangla = profile.medium === 'bangla';
  
  const questions = useMemo(() => {
    const subjectQuestions = sampleQuestions.filter(q => q.subjectId === subjectId);
    // If no subject-specific questions, show sample from all
    if (subjectQuestions.length === 0) {
      return sampleQuestions.slice(0, 5);
    }
    return subjectQuestions.slice(0, 5);
  }, [subjectId]);

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
            <div className="glass-card rounded-2xl p-6 mb-8">
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
            <div className="flex justify-center gap-2 mb-8">
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
          </div>
        )}
      </main>
    </div>
  );
};
