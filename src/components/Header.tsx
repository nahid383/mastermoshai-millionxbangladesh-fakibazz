import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { Home, BookOpen, BarChart3, User, Flame, Zap, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useStudent();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/learn', icon: GraduationCap, label: 'Learn' },
    { path: '/subjects', icon: BookOpen, label: 'Quiz' },
    { path: '/leaderboard', icon: Trophy, label: 'Rank' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm">
              🎓
            </div>
            <span className="gradient-text hidden sm:block">Master-Moshai</span>
          </button>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{profile.streak}</span>
            </div>
            
            {/* Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">{profile.totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 pb-3 -mx-1 overflow-x-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => navigate(path)}
                className={cn(
                  'flex-1 min-w-[70px] gap-1.5',
                  isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
