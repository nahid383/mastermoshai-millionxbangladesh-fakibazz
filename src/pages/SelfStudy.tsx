import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleNotes, sampleQuestions } from '@/lib/data';
import { ArrowLeft, BookOpen, Sparkles, CheckCircle, AlertCircle, Trophy, ChevronRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type StudyState = 'reading' | 'quiz-prompt' | 'quiz' | 'feedback';

export const SelfStudy: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, addPoints, recordAnswer, earnBadge, updateProfile } = useStudent();
  
  const [state, setState] = useState<StudyState>('reading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);
  const subject = subjects.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  
  // Get note and questions for this topic
  const note = sampleNotes.find(n => n.topicId === topicId);
  const questions = sampleQuestions.filter(q => q.topicId === topicId).slice(0, 10);
  const currentQuestion = questions[currentIndex];
  
  const isNoteRead = profile.readNotes?.includes(note?.id ?? '') ?? false;

  const handleStartQuiz = () => {
    setState('quiz');
  };

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
      // Track weak areas
      const questionTopic = useBangla && currentQuestion.questionBn 
        ? currentQuestion.questionBn.substring(0, 50)
        : currentQuestion.question.substring(0, 50);
      setWeakAreas(prev => [...prev, questionTopic]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete - calculate XP and show feedback
      const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
      const isPerfect = finalScore === questions.length;
      const baseXp = note?.xpReward || 30;
      const bonusXp = isPerfect ? 25 : Math.floor(finalScore / questions.length * 15);
      const totalXp = baseXp + bonusXp;
      
      addPoints(totalXp);
      
      // Mark note as read
      if (note && !isNoteRead) {
        updateProfile({
          readNotes: [...(profile.readNotes ?? []), note.id]
        });
      }
      
      if (isPerfect) {
        earnBadge('self_study_master');
      }
      
      toast({
        title: isPerfect 
          ? (useBangla ? '🎊 পারফেক্ট!' : '🎊 Perfect!')
          : (useBangla ? '✨ সম্পন্ন!' : '✨ Complete!'),
        description: `+${totalXp} XP ${useBangla ? 'অর্জিত' : 'earned'}`,
      });
      
      setState('feedback');
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

  const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
  const accuracy = questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0;

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? 'নিজে নিজে পড়ুন' : 'Study by Yourself'}
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
        {state === 'reading' && (
          <div className="animate-fade-in">
            {note ? (
              <>
                {/* Note Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {useBangla && note.titleBn ? note.titleBn : note.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      +{note.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Note Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert mb-8">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed p-4 bg-muted/30 rounded-xl">
                    {useBangla && note.contentBn ? note.contentBn : note.content}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setState('quiz-prompt')}
                  className="w-full"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {useBangla ? 'পড়া শেষ - পরীক্ষা দিন' : 'Finished Reading - Take Test'}
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {useBangla ? 'নোট পাওয়া যায়নি' : 'No notes available'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {useBangla 
                    ? 'এই বিষয়ের জন্য নোট শীঘ্রই আসছে'
                    : 'Notes for this topic coming soon'}
                </p>
                <Button onClick={() => navigate(`/learn/chapter/${subjectId}/${topicId}`)}>
                  {useBangla ? 'ফিরে যান' : 'Go Back'}
                </Button>
              </div>
            )}
          </div>
        )}

        {state === 'quiz-prompt' && (
          <div className="text-center py-12 animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
              <Target className="w-10 h-10 text-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {useBangla ? 'পরীক্ষার সময়!' : 'Test Time!'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {useBangla 
                ? 'আপনি যা শিখলেন তা যাচাই করুন। পরীক্ষার পর ব্যক্তিগত প্রতিক্রিয়া পাবেন।'
                : 'Test what you learned. Get personalized feedback after the exam.'}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{questions.length}</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'প্রশ্ন' : 'Questions'}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-success">+25</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'বোনাস XP' : 'Bonus XP'}</p>
              </div>
            </div>
            <Button variant="hero" size="lg" onClick={handleStartQuiz}>
              <Sparkles className="w-5 h-5 mr-2" />
              {useBangla ? 'পরীক্ষা শুরু' : 'Start Test'}
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
                    i < currentIndex ? 'bg-emerald-500' :
                    i === currentIndex ? 'bg-emerald-500/50' : 'bg-muted'
                  )}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {useBangla ? 'প্রশ্ন' : 'Question'} {currentIndex + 1}/{questions.length}
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
                      !showResult && 'border-border hover:border-emerald-500/50 hover:bg-emerald-500/5',
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
                onClick={handleNext}
                className="w-full mt-6"
              >
                {currentIndex + 1 >= questions.length 
                  ? (useBangla ? 'ফলাফল ও প্রতিক্রিয়া' : 'Results & Feedback') 
                  : (useBangla ? 'পরবর্তী' : 'Next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {state === 'feedback' && (
          <div className="animate-fade-in">
            {/* Score Card */}
            <div className={cn(
              'rounded-2xl p-6 mb-6 text-center',
              accuracy >= 80 ? 'bg-success/10 border-2 border-success/30' :
              accuracy >= 60 ? 'bg-warning/10 border-2 border-warning/30' :
              'bg-destructive/10 border-2 border-destructive/30'
            )}>
              <div className={cn(
                'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
                accuracy >= 80 ? 'bg-success/20 text-success' :
                accuracy >= 60 ? 'bg-warning/20 text-warning' :
                'bg-destructive/20 text-destructive'
              )}>
                {accuracy >= 80 ? (
                  <Trophy className="w-10 h-10" />
                ) : (
                  <span className="text-3xl font-bold">{accuracy}%</span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {accuracy >= 80 
                  ? (useBangla ? 'চমৎকার!' : 'Excellent!')
                  : accuracy >= 60 
                    ? (useBangla ? 'ভালো!' : 'Good!')
                    : (useBangla ? 'আরও অনুশীলন প্রয়োজন' : 'Needs More Practice')}
              </h2>
              <p className="text-muted-foreground">
                {finalScore}/{questions.length} {useBangla ? 'সঠিক উত্তর' : 'correct answers'}
              </p>
            </div>

            {/* Advisory Feedback */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 mb-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {useBangla ? 'ব্যক্তিগত পরামর্শ' : 'Personalized Advisory'}
              </h3>
              
              {accuracy >= 80 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {useBangla 
                      ? `আপনি "${topic.nameBn}" বিষয়ে চমৎকার দক্ষতা দেখিয়েছেন! আপনি পরবর্তী অধ্যায়ে যেতে পারেন।`
                      : `You've shown excellent understanding of "${topic.name}"! You're ready to move to the next chapter.`}
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">
                      {useBangla ? 'এই অধ্যায় সম্পন্ন!' : 'Chapter mastered!'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {useBangla 
                      ? 'আপনার কিছু এলাকায় আরও অনুশীলন প্রয়োজন:'
                      : 'You need more practice in these areas:'}
                  </p>
                  
                  {weakAreas.length > 0 && (
                    <div className="space-y-2">
                      {weakAreas.map((area, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                          <span className="text-sm text-foreground">{area}...</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium text-foreground mb-2">
                      {useBangla ? 'পরামর্শ:' : 'Recommendation:'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {useBangla 
                        ? 'নোট আবার পড়ুন এবং AI মাস্টারের সাহায্য নিন। তারপর আবার পরীক্ষা দিন।'
                        : 'Review the notes again and ask AI Master for help with difficult concepts. Then retake the test.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setState('reading');
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setScore(0);
                  setWeakAreas([]);
                }}
              >
                {useBangla ? 'আবার পড়ুন' : 'Read Again'}
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => navigate(`/learn/chapter/${subjectId}/${topicId}`)}
              >
                {useBangla ? 'ফিরে যান' : 'Back to Chapter'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
