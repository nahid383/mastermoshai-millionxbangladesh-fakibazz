import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { SubjectCard } from '@/components/SubjectCard';
import { StatsCard } from '@/components/StatsCard';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { subjects } from '@/lib/data';
import { Zap, Target, Trophy, TrendingUp, Sparkles, BookOpen, Bot } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  
  const dailyProgress = Math.min((profile.dailyProgress / profile.dailyGoal) * 100, 100);
  const accuracy = profile.questionsAnswered > 0 
    ? Math.round((profile.correctAnswers / profile.questionsAnswered) * 100) 
    : 0;
  
  const useBangla = profile.medium === 'bangla';
  const greeting = useBangla ? 'স্বাগতম' : 'Welcome back';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PWAInstallBanner />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {profile.name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {useBangla ? 'আজ কিছু নতুন শিখি!' : "Let's learn something new today!"}
          </p>
        </div>

        {/* Daily Goal Card */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-6">
            <ProgressRing progress={dailyProgress} size={100} strokeWidth={10}>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{profile.dailyProgress}</p>
                <p className="text-xs text-muted-foreground">/{profile.dailyGoal}</p>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Daily Goal</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {dailyProgress >= 100 
                  ? '🎉 Goal completed! Keep the momentum going!' 
                  : `${profile.dailyGoal - profile.dailyProgress} more questions to reach your goal`}
              </p>
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => navigate('/subjects')}
              >
                <Sparkles className="w-4 h-4" />
                Start Practice
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatsCard
            title="Total Points"
            value={profile.totalPoints}
            icon={Zap}
            trend="up"
            trendValue="+12%"
            delay={100}
          />
          <StatsCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={Target}
            trend={accuracy >= 70 ? 'up' : 'neutral'}
            trendValue={accuracy >= 70 ? 'Great!' : 'Practice more'}
            delay={150}
          />
          <StatsCard
            title="Questions"
            value={profile.questionsAnswered}
            subtitle="Total answered"
            icon={BookOpen}
            delay={200}
          />
          <StatsCard
            title="Badges"
            value={profile.badges.length}
            subtitle={`${8 - profile.badges.length} more to unlock`}
            icon={Trophy}
            delay={250}
          />
        </div>

        {/* Weak Topics Alert */}
        {profile.weakTopics.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">Focus Areas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Practice these topics to improve: {profile.weakTopics.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Card */}
        <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up bg-gradient-to-br from-primary/10 to-accent/10" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'মাস্টার মশাই AI' : 'Master Moshai AI'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {useBangla ? 'যেকোনো প্রশ্নের উত্তর পান' : 'Ask any study question'}
              </p>
            </div>
            <Button variant="hero" size="sm" onClick={() => navigate('/ai-chat')}>
              <Sparkles className="w-4 h-4" />
              {useBangla ? 'জিজ্ঞাসা করুন' : 'Ask AI'}
            </Button>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {useBangla ? 'বিষয়সমূহ' : 'Subjects'}
          </h2>
          <div className="space-y-3">
            {subjects.slice(0, 4).map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                useBangla={useBangla}
                onClick={() => navigate(`/quiz/${subject.id}`)}
                progress={Math.floor(Math.random() * 60)} // Demo progress
                delay={index * 50}
              />
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate('/subjects')}
          >
            View All Subjects
          </Button>
        </div>

        {/* Badges Preview */}
        {profile.badges.length > 0 && (
          <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Badges</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                View all
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {profile.badges.slice(-4).map((badge) => (
                <div
                  key={badge.id}
                  className="flex-shrink-0 w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
