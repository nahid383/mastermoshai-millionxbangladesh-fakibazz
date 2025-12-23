import React, { useState } from 'react';
import { Question } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Lightbulb, Volume2 } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  useBangla?: boolean;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  useBangla = false,
  onAnswer,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const questionText = useBangla && question.questionBn ? question.questionBn : question.question;
  const options = useBangla && question.optionsBn ? question.optionsBn : question.options;
  const explanation = useBangla && question.explanationBn ? question.explanationBn : question.explanation;

  const handleOptionClick = (index: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(index);
    setHasAnswered(true);
    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer === question.correctAnswer);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto animate-scale-in">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary">
            +{question.points} pts
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className={cn(
            'text-xl font-semibold text-foreground leading-relaxed',
            useBangla && 'font-bengali'
          )}>
            {questionText}
          </h2>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            
            let optionStyle = 'border-border hover:border-primary/50 hover:bg-primary/5';
            if (hasAnswered) {
              if (isCorrectOption) {
                optionStyle = 'border-success bg-success/10 text-success';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-destructive bg-destructive/10 text-destructive';
              } else {
                optionStyle = 'border-border opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'border-primary bg-primary/10';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={hasAnswered}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                  'flex items-center gap-4',
                  optionStyle,
                  useBangla && 'font-bengali'
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                  hasAnswered && isCorrectOption ? 'bg-success text-success-foreground' :
                  hasAnswered && isSelected && !isCorrectOption ? 'bg-destructive text-destructive-foreground' :
                  'bg-muted text-muted-foreground'
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={cn(
          'rounded-2xl p-6 mb-6 animate-slide-up',
          isCorrect ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            )}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={cn(
                'font-semibold mb-2',
                isCorrect ? 'text-success' : 'text-destructive'
              )}>
                {isCorrect ? 'Excellent! 🎉' : 'Not quite right'}
              </h3>
              <p className={cn(
                'text-sm leading-relaxed',
                isCorrect ? 'text-success/80' : 'text-foreground/80',
                useBangla && 'font-bengali'
              )}>
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Continue button */}
      {hasAnswered && (
        <Button
          onClick={handleContinue}
          variant={isCorrect ? 'success' : 'default'}
          size="lg"
          className="w-full animate-slide-up"
        >
          {isCorrect ? `+${question.points} points • Continue` : 'Continue Learning'}
        </Button>
      )}
    </div>
  );
};
