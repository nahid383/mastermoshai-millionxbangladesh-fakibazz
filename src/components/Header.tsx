import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { Home, BookOpen, BarChart3, User, Flame, Zap, GraduationCap, Trophy, Brain, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const mainNavItems = [
    { path: '/dashboard', icon: Home, label: useBangla ? 'হোম' : 'Home' },
    { path: '/learn', icon: GraduationCap, label: useBangla ? 'শিখুন' : 'Learn' },
    { path: '/subjects', icon: BookOpen, label: useBangla ? 'কুইজ' : 'Quiz' },
    { path: '/leaderboard', icon: Trophy, label: useBangla ? 'র‍্যাংক' : 'Rank' },
  ];

  const moreItems = [
    { path: '/university-prep', label: useBangla ? 'ভর্তি প্রস্তুতি' : 'University Prep' },
    { path: '/weakness-heatmap', label: useBangla ? 'দুর্বলতা হিটম্যাপ' : 'Weakness Heatmap' },
    { path: '/study-planner', label: useBangla ? 'স্টাডি প্ল্যানার' : 'Study Planner' },
    { path: '/time-pressure', label: useBangla ? 'টাইম প্রেশার' : 'Time Pressure' },
    { path: '/doubt-resolver', label: useBangla ? 'ডাউট সলভার' : 'Doubt Resolver' },
    { path: '/mental-support', label: useBangla ? 'মানসিক সহায়তা' : 'Mental Support' },
    { path: '/answer-checker', label: useBangla ? 'উত্তর যাচাই' : 'Answer Checker' },
    { path: '/progress', label: useBangla ? 'প্রগ্রেস' : 'Progress' },
    { path: '/profile', label: useBangla ? 'প্রোফাইল' : 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
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
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/10 text-warning">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{profile.streak}</span>
            </div>
            
            {/* Points */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{profile.totalPoints}</span>
            </div>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      location.pathname === item.path && 'bg-primary/10 text-primary'
                    )}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 pb-2 -mx-1 overflow-x-auto scrollbar-hide">
          {mainNavItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path === '/learn' && location.pathname.startsWith('/learn'));
            return (
              <Button
                key={path}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => navigate(path)}
                className={cn(
                  'flex-1 min-w-[60px] gap-1 h-9',
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
