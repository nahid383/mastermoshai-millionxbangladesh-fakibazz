import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleQuestions } from '@/lib/data';
import { ArrowLeft, FileQuestion, CheckCircle, XCircle, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type QuizState = 'intro' | 'quiz' | 'complete';

export const BoardQuestions: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, addPoints, recordAnswer, earnBadge } = useStudent();
  
  const [state, setState] = useState<QuizState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; question: string }[]>([]);

  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);
  const subject = subjects.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  
  // Get questions for this topic
  const questions = sampleQuestions.filter(q => q.topicId === topicId).slice(0, 10);
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      recordAnswer(true, topicId || '');
    } else {
      recordAnswer(false, topicId || '');
    }
    
    setAnswers(prev => [...prev, {
      correct: isCorrect,
      question: useBangla && currentQuestion.questionBn ? currentQuestion.questionBn : currentQuestion.question
    }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete
      const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      const xpEarned = finalScore * 10;
      addPoints(xpEarned);
      
      if (finalScore === questions.length) {
        earnBadge('board_master');
      }
      
      toast({
        title: finalScore === questions.length 
          ? (useBangla ? '🎊 পারফেক্ট!' : '🎊 Perfect!')
          : (useBangla ? '✨ শেষ!' : '✨ Complete!'),
        description: `+${xpEarned} XP ${useBangla ? 'অর্জিত' : 'earned'}`,
      });
      
      setState('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Button onClick={() => navigate('/learn')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/learn/chapter/${subjectId}/${topicId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? 'বোর্ড প্রশ্ন' : 'Board Questions'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {useBangla ? topic.nameBn : topic.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {state === 'intro' && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
              <FileQuestion className="w-12 h-12 text-orange-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {useBangla ? 'বোর্ড প্রশ্ন বিশ্লেষণ' : 'Board Question Analysis'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {useBangla 
                ? 'পূর্ববর্তী বোর্ড পরীক্ষার প্রশ্ন অনুশীলন করুন এবং বিস্তারিত ব্যাখ্যা পান।'
                : 'Practice questions from previous board exams and get detailed explanations.'}
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-muted-foreground">{useBangla ? 'প্রশ্ন' : 'Questions'}</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-success">+{questions.length * 10}</p>
                <p className="text-sm text-muted-foreground">XP</p>
              </div>
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => setState('quiz')}
              disabled={questions.length === 0}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {questions.length > 0 
                ? (useBangla ? 'শুরু করুন' : 'Start Practice')
                : (useBangla ? 'প্রশ্ন নেই' : 'No Questions Available')}
            </Button>
          </div>
        )}

        {state === 'quiz' && currentQuestion && (
          <div className="max-w-lg mx-auto animate-fade-in">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-colors',
                    i < currentIndex ? 'bg-primary' :
                    i === currentIndex ? 'bg-primary/50' : 'bg-muted'
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {useBangla ? 'প্রশ্ন' : 'Question'} {currentIndex + 1}/{questions.length}
              </p>
              <span className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                currentQuestion.difficulty === 'easy' && 'bg-success/10 text-success',
                currentQuestion.difficulty === 'medium' && 'bg-warning/10 text-warning',
                currentQuestion.difficulty === 'hard' && 'bg-destructive/10 text-destructive'
              )}>
                {useBangla 
                  ? (currentQuestion.difficulty === 'easy' ? 'সহজ' : currentQuestion.difficulty === 'medium' ? 'মাঝারি' : 'কঠিন')
                  : currentQuestion.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-6">
              {useBangla && currentQuestion.questionBn 
                ? currentQuestion.questionBn 
                : currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {(useBangla && currentQuestion.optionsBn 
                ? currentQuestion.optionsBn 
                : currentQuestion.options
              ).map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === currentQuestion.correctAnswer;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 text-left transition-all',
                      'flex items-center gap-3',
                      showResult && isCorrect && 'border-success bg-success/10',
                      showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10',
                      !showResult && 'border-border hover:border-primary/50 hover:bg-primary/5',
                      !showResult && 'active:scale-[0.98]'
                    )}
                  >
                    <span className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                      showResult && isCorrect && 'bg-success text-success-foreground',
                      showResult && isSelected && !isCorrect && 'bg-destructive text-destructive-foreground',
                      !showResult && 'bg-muted text-muted-foreground'
                    )}>
                      {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> : 
                       showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
                <p className="text-sm font-medium text-foreground mb-2">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? (useBangla ? '✓ সঠিক উত্তর!' : '✓ Correct!') 
                    : (useBangla ? '✗ ভুল উত্তর!' : '✗ Incorrect!')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {useBangla && currentQuestion.explanationBn 
                    ? currentQuestion.explanationBn 
                    : currentQuestion.explanation}
                </p>
              </div>
            )}

            {selectedAnswer !== null && (
              <Button
                variant="hero"
                size="lg"
                onClick={handleNext}
                className="w-full mt-6"
              >
                {currentIndex + 1 >= questions.length 
                  ? (useBangla ? 'ফলাফল দেখুন' : 'See Results') 
                  : (useBangla ? 'পরবর্তী' : 'Next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {state === 'complete' && (
          <div className="text-center py-12 animate-scale-in">
            <div className={cn(
              'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
              score === questions.length 
                ? 'bg-success/20 text-success' 
                : 'bg-primary/20 text-primary'
            )}>
              {score === questions.length ? (
                <span className="text-4xl">🎊</span>
              ) : (
                <Trophy className="w-12 h-12" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {score === questions.length 
                ? (useBangla ? 'পারফেক্ট স্কোর!' : 'Perfect Score!')
                : (useBangla ? 'অনুশীলন সম্পন্ন!' : 'Practice Complete!')}
            </h2>

            <p className="text-muted-foreground mb-4">
              {useBangla 
                ? `আপনি ${score}/${questions.length} সঠিক উত্তর দিয়েছেন` 
                : `You answered ${score}/${questions.length} correctly`}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-8">
              <Sparkles className="w-5 h-5" />
              +{score * 10} XP
            </div>

            {/* Answer Summary */}
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-3 text-left">
                {useBangla ? 'উত্তর সারাংশ:' : 'Answer Summary:'}
              </h3>
              <div className="space-y-2">
                {answers.map((answer, i) => (
                  <div 
                    key={i}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg text-left text-sm',
                      answer.correct ? 'bg-success/10' : 'bg-destructive/10'
                    )}
                  >
                    {answer.correct ? (
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                    <span className="truncate">{answer.question}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 max-w-sm mx-auto">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setState('intro');
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setScore(0);
                  setAnswers([]);
                }}
              >
                {useBangla ? 'আবার চেষ্টা' : 'Try Again'}
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => navigate(`/learn/chapter/${subjectId}/${topicId}`)}
              >
                {useBangla ? 'ফিরে যান' : 'Go Back'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
