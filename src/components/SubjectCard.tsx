import React from 'react';
import { Subject } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  progress?: number;
  onClick: () => void;
  useBangla?: boolean;
  delay?: number;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  progress = 0,
  onClick,
  useBangla = false,
  delay = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full p-5 rounded-2xl bg-card border border-border/50',
        'hover:shadow-elevated hover:border-primary/30 hover:scale-[1.02]',
        'transition-all duration-300 text-left animate-slide-up',
        'focus:outline-none focus:ring-2 focus:ring-primary/50'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
            'bg-gradient-to-br shadow-md',
            subject.color
          )}
        >
          {subject.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {useBangla ? subject.nameBn : subject.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {subject.topics.length} topics
          </p>
        </div>

        {/* Progress & Arrow */}
        <div className="flex items-center gap-3">
          {progress > 0 && (
            <div className="text-right">
              <div className="text-sm font-medium text-primary">{progress}%</div>
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
};
