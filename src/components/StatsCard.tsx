import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-5 animate-slide-up',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && trendValue && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up' && 'bg-success/10 text-success',
            trend === 'down' && 'bg-destructive/10 text-destructive',
            trend === 'neutral' && 'bg-muted text-muted-foreground'
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
