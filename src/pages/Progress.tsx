import React from 'react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { ProgressRing } from '@/components/ProgressRing';
import { useStudent } from '@/context/StudentContext';
import { subjects } from '@/lib/data';
import { 
  Target, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Award,
  AlertTriangle,
  CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Progress: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const accuracy = profile.questionsAnswered > 0 
    ? Math.round((profile.correctAnswers / profile.questionsAnswered) * 100) 
    : 0;

  // Mock subject progress data
  const subjectProgress = subjects.map(subject => ({
    ...subject,
    progress: Math.floor(Math.random() * 100),
    questionsAttempted: Math.floor(Math.random() * 50),
    accuracy: Math.floor(Math.random() * 40) + 60,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {useBangla ? 'অগ্রগতি' : 'Your Progress'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {useBangla ? 'আপনার শেখার যাত্রা ট্র্যাক করুন' : 'Track your learning journey'}
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatsCard
            title="Total Points"
            value={profile.totalPoints}
            icon={Zap}
            trend="up"
            trendValue="+12%"
            delay={0}
          />
          <StatsCard
            title="Overall Accuracy"
            value={`${accuracy}%`}
            icon={Target}
            trend={accuracy >= 70 ? 'up' : 'neutral'}
            trendValue={accuracy >= 70 ? 'Great!' : 'Keep going'}
            delay={50}
          />
          <StatsCard
            title="Questions Answered"
            value={profile.questionsAnswered}
            icon={BookOpen}
            delay={100}
          />
          <StatsCard
            title="Learning Streak"
            value={`${profile.streak} days`}
            icon={TrendingUp}
            delay={150}
          />
        </div>

        {/* Performance Overview */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-foreground mb-6">Performance Overview</h2>
          <div className="flex items-center justify-around">
            <ProgressRing progress={accuracy} size={120} strokeWidth={12}>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </ProgressRing>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profile.correctAnswers}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {profile.questionsAnswered - profile.correctAnswers}
                  </p>
                  <p className="text-xs text-muted-foreground">Incorrect</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-4">Subject Progress</h2>
          <div className="space-y-3">
            {subjectProgress.map((subject, index) => (
              <div
                key={subject.id}
                className="glass-card rounded-xl p-4 animate-slide-up"
                style={{ animationDelay: `${150 + index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-xl',
                    'bg-gradient-to-br shadow-sm',
                    subject.color
                  )}>
                    {subject.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground truncate">
                        {useBangla ? subject.nameBn : subject.name}
                      </h3>
                      <span className="text-sm font-semibold text-primary">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{subject.questionsAttempted} questions</span>
                      <span>{subject.accuracy}% accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak & Strong Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weak Topics */}
          <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'দুর্বল বিষয়' : 'Needs Practice'}
              </h3>
            </div>
            {profile.weakTopics.length > 0 ? (
              <ul className="space-y-2">
                {profile.weakTopics.map(topic => (
                  <li
                    key={topic}
                    className="text-sm text-muted-foreground px-3 py-2 bg-warning/5 rounded-lg"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No weak topics yet. Keep practicing!
              </p>
            )}
          </div>

          {/* Strong Topics */}
          <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '450ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'শক্তিশালী বিষয়' : 'Strong Topics'}
              </h3>
            </div>
            {profile.strongTopics.length > 0 ? (
              <ul className="space-y-2">
                {profile.strongTopics.map(topic => (
                  <li
                    key={topic}
                    className="text-sm text-muted-foreground px-3 py-2 bg-success/5 rounded-lg"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Answer more questions to discover your strengths!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
