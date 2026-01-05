import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface LearningPathCardProps {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  icon: LucideIcon;
  gradient: string;
  useBangla: boolean;
  onClick: () => void;
  badge?: string;
  badgeBn?: string;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  titleBn,
  description,
  descriptionBn,
  icon: Icon,
  gradient,
  useBangla,
  onClick,
  badge,
  badgeBn
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 border-border bg-card',
        'hover:border-primary/50 hover:shadow-lg transition-all duration-300',
        'flex flex-col items-start gap-3 text-left group',
        'active:scale-[0.98]'
      )}
    >
      <div className="flex items-start justify-between w-full">
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform',
          gradient
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {badge && (
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {useBangla && badgeBn ? badgeBn : badge}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {useBangla ? titleBn : title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {useBangla ? descriptionBn : description}
        </p>
      </div>
    </button>
  );
};
