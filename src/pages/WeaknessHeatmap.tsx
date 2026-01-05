import React, { useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, subjects as allSubjects } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Target, ChevronRight, Flame, ThermometerSun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicPerformance {
  topicId: string;
  topicName: string;
  topicNameBn: string;
  subjectId: string;
  subjectName: string;
  accuracy: number;
  attempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const WeaknessHeatmap: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');
  
  // Generate mock performance data based on weak/strong topics
  const topicPerformance = useMemo(() => {
    const performance: TopicPerformance[] = [];
    
    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        const isWeak = profile.weakTopics.includes(topic.name);
        const isStrong = profile.strongTopics.includes(topic.name);
        
        let accuracy = 50 + Math.random() * 30; // Base random
        if (isWeak) accuracy = 20 + Math.random() * 30;
        if (isStrong) accuracy = 70 + Math.random() * 25;
        
        performance.push({
          topicId: topic.id,
          topicName: topic.name,
          topicNameBn: topic.nameBn,
          subjectId: subject.id,
          subjectName: useBangla ? subject.nameBn : subject.name,
          accuracy: Math.round(accuracy),
          attempts: Math.floor(Math.random() * 50) + 5,
          difficulty: topic.difficulty,
        });
      });
    });
    
    return performance.sort((a, b) => a.accuracy - b.accuracy);
  }, [subjects, profile.weakTopics, profile.strongTopics, useBangla]);
  
  const getHeatColor = (accuracy: number) => {
    if (accuracy < 40) return 'from-destructive to-destructive/80';
    if (accuracy < 60) return 'from-warning to-warning/80';
    if (accuracy < 75) return 'from-accent to-accent/80';
    return 'from-success to-success/80';
  };
  
  const getHeatBg = (accuracy: number) => {
    if (accuracy < 40) return 'bg-destructive/10 border-destructive/20';
    if (accuracy < 60) return 'bg-warning/10 border-warning/20';
    if (accuracy < 75) return 'bg-accent/10 border-accent/20';
    return 'bg-success/10 border-success/20';
  };
  
  const weakestTopics = topicPerformance.filter(t => t.accuracy < 50).slice(0, 5);
  const strongestTopics = [...topicPerformance].sort((a, b) => b.accuracy - a.accuracy).slice(0, 5);
  
  const overallWeakness = topicPerformance.length > 0 
    ? Math.round(topicPerformance.reduce((sum, t) => sum + t.accuracy, 0) / topicPerformance.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-destructive/10 to-warning/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive to-warning flex items-center justify-center">
              <ThermometerSun className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'দুর্বলতা হিটম্যাপ' : 'Weakness Heatmap'}
              </h1>
              <p className="text-muted-foreground">
                {useBangla ? 'তোমার দুর্বল বিষয়গুলো খুঁজে বের করো' : 'Identify your weak areas visually'}
              </p>
            </div>
          </div>
          
          {/* Overall Score */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-destructive via-warning to-success transition-all duration-1000"
                  style={{ width: `${overallWeakness}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-foreground">{overallWeakness}%</span>
          </div>
        </div>

        {/* Critical Areas */}
        {weakestTopics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-semibold text-foreground">
                {useBangla ? 'জরুরি অভ্যাস প্রয়োজন' : 'Needs Immediate Practice'}
              </h2>
            </div>
            <div className="space-y-3">
              {weakestTopics.map((topic, index) => (
                <button
                  key={topic.topicId}
                  onClick={() => navigate(`/learn/self-study/${topic.subjectId}/${topic.topicId}`)}
                  className={cn(
                    "w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 hover:scale-[1.02]",
                    getHeatBg(topic.accuracy)
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold",
                    getHeatColor(topic.accuracy)
                  )}>
                    {topic.accuracy}%
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? topic.topicNameBn : topic.topicName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.subjectName} • {topic.attempts} attempts
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Heatmap Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {useBangla ? 'সকল বিষয় হিটম্যাপ' : 'All Topics Heatmap'}
            </h2>
          </div>
          
          {subjects.map(subject => (
            <div key={subject.id} className="mb-6">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <span className="text-xl">{subject.icon}</span>
                {useBangla ? subject.nameBn : subject.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {subject.topics.map(topic => {
                  const perf = topicPerformance.find(t => t.topicId === topic.id);
                  const accuracy = perf?.accuracy || 50;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => navigate(`/learn/self-study/${subject.id}/${topic.id}`)}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all hover:scale-105",
                        getHeatBg(accuracy)
                      )}
                    >
                      <div className={cn(
                        "text-2xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                        getHeatColor(accuracy)
                      )}>
                        {accuracy}%
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {useBangla ? topic.nameBn : topic.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Strong Topics */}
        {strongestTopics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="text-lg font-semibold text-foreground">
                {useBangla ? 'তোমার শক্তিশালী দিক' : 'Your Strengths'}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {strongestTopics.map((topic) => (
                <div
                  key={topic.topicId}
                  className="p-4 rounded-xl bg-success/10 border border-success/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-success" />
                    <span className="text-lg font-bold text-success">{topic.accuracy}%</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {useBangla ? topic.topicNameBn : topic.topicName}
                  </p>
                  <p className="text-xs text-muted-foreground">{topic.subjectName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-medium text-foreground mb-3">
            {useBangla ? 'রঙের অর্থ' : 'Color Legend'}
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive" />
              <span className="text-sm text-muted-foreground">&lt;40% Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span className="text-sm text-muted-foreground">40-60% Weak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span className="text-sm text-muted-foreground">60-75% Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-sm text-muted-foreground">&gt;75% Strong</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
