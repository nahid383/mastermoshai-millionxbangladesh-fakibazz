import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { sampleNotes, sampleQuestions } from '@/lib/data';
import { ArrowLeft, Clock, Sparkles, CheckCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ReadingState = 'reading' | 'quiz-prompt' | 'quiz' | 'complete';

export const NoteReader: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, addPoints, updateProfile, recordAnswer, earnBadge } = useStudent();
  
  const [state, setState] = useState<ReadingState>('reading');
  const [readProgress, setReadProgress] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const note = sampleNotes.find(n => n.id === noteId);
  const useBangla = profile.medium === 'bangla';
  
  // Get questions for the surprise test (from the note's topic)
  const quizQuestions = note 
    ? sampleQuestions.filter(q => q.topicId === note.topicId).slice(0, 3)
    : [];

  const isNoteRead = profile.readNotes?.includes(noteId ?? '') ?? false;

  // Simulate reading progress
  useEffect(() => {
    if (state !== 'reading' || !note) return;
    
    const interval = setInterval(() => {
      setReadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, (note.readTime * 60 * 1000) / 50); // Complete in readTime minutes

    return () => clearInterval(interval);
  }, [state, note]);

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Note not found</h1>
          <Button onClick={() => navigate('/learn')}>Back to Learning</Button>
        </div>
      </div>
    );
  }

  const handleFinishReading = () => {
    if (quizQuestions.length > 0) {
      setState('quiz-prompt');
    } else {
      // No quiz available, just give XP
      if (!isNoteRead) {
        addPoints(note.xpReward);
        updateProfile({
          readNotes: [...(profile.readNotes ?? []), note.id]
        });
        toast({
          title: useBangla ? 'XP অর্জিত!' : 'XP Earned!',
          description: `+${note.xpReward} XP ${useBangla ? 'যোগ হয়েছে' : 'added to your profile'}`,
        });
      }
      setState('complete');
    }
  };

  const handleStartQuiz = () => {
    setState('quiz');
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    const question = quizQuestions[quizIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      recordAnswer(true, question.topicId);
    } else {
      recordAnswer(false, question.topicId);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 >= quizQuestions.length) {
      // Quiz complete
      const isPerfect = quizScore + (selectedAnswer === quizQuestions[quizIndex].correctAnswer ? 1 : 0) === quizQuestions.length;
      const bonusXp = isPerfect ? 20 : 10;
      const totalXp = note.xpReward + bonusXp;
      
      if (!isNoteRead) {
        addPoints(totalXp);
        updateProfile({
          readNotes: [...(profile.readNotes ?? []), note.id]
        });
        
        if (isPerfect) {
          earnBadge('surprise_ace');
        }
        
        // Check for bookworm badge
        const totalRead = (profile.readNotes?.length ?? 0) + 1;
        if (totalRead >= 5) {
          earnBadge('note_reader');
        }
      }
      
      toast({
        title: isPerfect 
          ? (useBangla ? '🎊 পারফেক্ট স্কোর!' : '🎊 Perfect Score!') 
          : (useBangla ? '✨ দুর্দান্ত!' : '✨ Great Job!'),
        description: `+${totalXp} XP ${useBangla ? 'অর্জিত' : 'earned'}`,
      });
      
      setState('complete');
    } else {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const currentQuestion = quizQuestions[quizIndex];
  const finalScore = quizScore + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/learn')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground truncate">
                {useBangla && note.titleBn ? note.titleBn : note.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {note.readTime} min
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <Sparkles className="w-3 h-3" />
                  +{note.xpReward} XP
                </span>
              </div>
            </div>
          </div>
          
          {/* Reading progress bar */}
          {state === 'reading' && (
            <div className="h-1 bg-muted -mx-4">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${readProgress}%` }}
              />
            </div>
          )}
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {state === 'reading' && (
          <div className="animate-fade-in">
            {/* Note content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {useBangla && note.contentBn ? note.contentBn : note.content}
              </div>
            </div>

            {/* Finish button */}
            <div className="mt-8 pt-6 border-t border-border">
              <Button
                variant="hero"
                size="lg"
                onClick={handleFinishReading}
                className="w-full"
                disabled={readProgress < 50}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {readProgress < 50 
                  ? (useBangla ? 'পড়া চলছে...' : 'Reading...') 
                  : (useBangla ? 'পড়া শেষ করুন' : 'Finish Reading')}
              </Button>
              {readProgress < 50 && (
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {useBangla ? 'নোটটি সম্পূর্ণ পড়ুন' : 'Read at least 50% to continue'}
                </p>
              )}
            </div>
          </div>
        )}

        {state === 'quiz-prompt' && (
          <div className="text-center py-12 animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              🎯 {useBangla ? 'সারপ্রাইজ টেস্ট!' : 'Surprise Test!'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {useBangla 
                ? 'আপনি যা শিখলেন তা পরীক্ষা করুন! সঠিক উত্তর দিলে বোনাস XP পাবেন।' 
                : 'Test what you learned! Answer correctly to earn bonus XP.'}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{quizQuestions.length}</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'প্রশ্ন' : 'Questions'}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-success">+20</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'বোনাস XP' : 'Bonus XP'}</p>
              </div>
            </div>
            <Button variant="hero" size="lg" onClick={handleStartQuiz}>
              <Sparkles className="w-5 h-5 mr-2" />
              {useBangla ? 'টেস্ট শুরু করুন' : 'Start Test'}
            </Button>
          </div>
        )}

        {state === 'quiz' && currentQuestion && (
          <div className="max-w-lg mx-auto animate-fade-in">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {quizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-colors',
                    i < quizIndex ? 'bg-primary' :
                    i === quizIndex ? 'bg-primary/50' : 'bg-muted'
                  )}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {useBangla ? 'প্রশ্ন' : 'Question'} {quizIndex + 1}/{quizQuestions.length}
            </p>

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
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
                <p className="text-sm font-medium text-foreground mb-1">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? (useBangla ? '✓ সঠিক!' : '✓ Correct!') 
                    : (useBangla ? '✗ ভুল!' : '✗ Incorrect!')}
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
                onClick={handleNextQuestion}
                className="w-full mt-6"
              >
                {quizIndex + 1 >= quizQuestions.length 
                  ? (useBangla ? 'ফলাফল দেখুন' : 'See Results') 
                  : (useBangla ? 'পরবর্তী' : 'Next')}
              </Button>
            )}
          </div>
        )}

        {state === 'complete' && (
          <div className="text-center py-12 animate-scale-in">
            <div className={cn(
              'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
              finalScore === quizQuestions.length 
                ? 'bg-success/20 text-success' 
                : 'bg-primary/20 text-primary'
            )}>
              {finalScore === quizQuestions.length ? (
                <span className="text-4xl">🎊</span>
              ) : (
                <CheckCircle className="w-12 h-12" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {quizQuestions.length > 0 
                ? (finalScore === quizQuestions.length 
                    ? (useBangla ? 'পারফেক্ট!' : 'Perfect!') 
                    : (useBangla ? 'দুর্দান্ত!' : 'Great Job!'))
                : (useBangla ? 'পড়া সম্পন্ন!' : 'Reading Complete!')}
            </h2>

            {quizQuestions.length > 0 && (
              <p className="text-muted-foreground mb-4">
                {useBangla 
                  ? `আপনি ${finalScore}/${quizQuestions.length} সঠিক উত্তর দিয়েছেন` 
                  : `You answered ${finalScore}/${quizQuestions.length} correctly`}
              </p>
            )}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-8">
              <Sparkles className="w-5 h-5" />
              +{note.xpReward + (finalScore === quizQuestions.length ? 20 : 10)} XP
            </div>

            <div className="flex gap-3 max-w-sm mx-auto">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/learn')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {useBangla ? 'আরও পড়ুন' : 'More Notes'}
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                {useBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
