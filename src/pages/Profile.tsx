import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { badges as allBadges } from '@/lib/data';
import { 
  User, 
  GraduationCap, 
  Globe, 
  Flame, 
  Zap,
  Trophy,
  Settings,
  LogOut,
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setIsOnboarded, updateProfile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const handleLogout = () => {
    setIsOnboarded(false);
    updateProfile({
      name: '',
      streak: 0,
      totalPoints: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      weakTopics: [],
      strongTopics: [],
      dailyProgress: 0,
      badges: [],
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-glow">
              👨‍🎓
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{profile.name || 'Student'}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile.level.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{profile.medium === 'english' ? 'English' : 'বাংলা'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-warning mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.totalPoints}</span>
              </div>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-accent mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.badges.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-foreground mb-4">
            {useBangla ? 'ব্যাজ সংগ্রহ' : 'Badges Collection'}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const earned = profile.badges.find(b => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all',
                    earned 
                      ? 'bg-accent/10 border-2 border-accent/30' 
                      : 'bg-muted/50 opacity-40 grayscale'
                  )}
                  title={badge.description}
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="text-[10px] text-center text-muted-foreground line-clamp-2">
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => {}}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">Settings</p>
              <p className="text-xs text-muted-foreground">Customize your learning experience</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => {}}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your name and preferences</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-destructive">Reset Progress</p>
              <p className="text-xs text-muted-foreground">Start fresh with a new profile</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* App Info */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>শিক্ষাসঙ্গী v1.0</p>
          <p className="mt-1">Made with ❤️ for Bangladeshi students</p>
          <p className="mt-1">MillionX Bangladesh Hackathon 2024</p>
        </div>
      </main>
    </div>
  );
};
