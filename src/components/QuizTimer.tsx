import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  timeLeft: number;
  percentage: number;
}

export function QuizTimer({ timeLeft, percentage }: QuizTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (percentage > 50) return 'text-green-500';
    if (percentage > 25) return 'text-yellow-500';
    return 'text-red-500 animate-pulse';
  };

  const getProgressColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-border/50">
      <Clock className={cn('w-5 h-5', getColorClass())} />
      <div className="flex flex-col gap-1">
        <span className={cn('text-lg font-bold tabular-nums', getColorClass())}>
          {formatTime(timeLeft)}
        </span>
        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-1000 ease-linear rounded-full', getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
