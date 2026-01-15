import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  Flame,
  Award,
  BookOpen,
  Brain,
  Zap,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const weeklyProgressData = [
  { day: 'Mon', questions: 12, correct: 9 },
  { day: 'Tue', questions: 18, correct: 14 },
  { day: 'Wed', questions: 8, correct: 6 },
  { day: 'Thu', questions: 22, correct: 19 },
  { day: 'Fri', questions: 15, correct: 12 },
  { day: 'Sat', questions: 25, correct: 21 },
  { day: 'Sun', questions: 20, correct: 17 },
];

const monthlyTrendData = [
  { week: 'W1', accuracy: 68 },
  { week: 'W2', accuracy: 72 },
  { week: 'W3', accuracy: 70 },
  { week: 'W4', accuracy: 78 },
];

const studyTimeData = [
  { name: 'Physics', value: 35, color: 'hsl(271, 91%, 65%)' },
  { name: 'Math', value: 25, color: 'hsl(199, 89%, 48%)' },
  { name: 'Chemistry', value: 20, color: 'hsl(142, 76%, 36%)' },
  { name: 'Biology', value: 20, color: 'hsl(45, 93%, 47%)' },
];

const examHistory = [
  { id: 1, subject: 'Physics', topic: 'Mechanics', score: 85, total: 100, date: '2026-01-10', duration: '25 min' },
  { id: 2, subject: 'Math', topic: 'Algebra', score: 72, total: 100, date: '2026-01-09', duration: '30 min' },
  { id: 3, subject: 'Chemistry', topic: 'Organic', score: 90, total: 100, date: '2026-01-08', duration: '22 min' },
  { id: 4, subject: 'Biology', topic: 'Cell Biology', score: 78, total: 100, date: '2026-01-07', duration: '28 min' },
  { id: 5, subject: 'Physics', topic: 'Electricity', score: 65, total: 100, date: '2026-01-06', duration: '35 min' },
];

export const Analytics: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'habits'>('overview');
  
  const subjects = getSubjectsByLevel(profile.level);
  
  const accuracy = profile.questionsAnswered > 0 
    ? Math.round((profile.correctAnswers / profile.questionsAnswered) * 100) 
    : 0;

  const weeklyQuestions = weeklyProgressData.reduce((sum, d) => sum + d.questions, 0);
  const avgDailyQuestions = Math.round(weeklyQuestions / 7);

  // Study consistency score (mock)
  const consistencyScore = 85;
  const avgStudyTime = '1h 45m';
  const peakHours = '7 PM - 9 PM';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {useBangla ? 'বিস্তারিত বিশ্লেষণ' : 'Detailed Analytics'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {useBangla ? 'আপনার শেখার প্যাটার্ন বিশ্লেষণ' : 'Analyze your learning patterns'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview' as const, label: useBangla ? 'সারসংক্ষেপ' : 'Overview', icon: BarChart3 },
            { id: 'history' as const, label: useBangla ? 'পরীক্ষার ইতিহাস' : 'Exam History', icon: Calendar },
            { id: 'habits' as const, label: useBangla ? 'অধ্যয়ন অভ্যাস' : 'Study Habits', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: useBangla ? 'মোট প্রশ্ন' : 'Total Questions', value: profile.questionsAnswered, icon: BookOpen, trend: '+12%', up: true },
                { label: useBangla ? 'নির্ভুলতা' : 'Accuracy', value: `${accuracy}%`, icon: Target, trend: '+5%', up: true },
                { label: useBangla ? 'স্ট্রিক' : 'Streak', value: `${profile.streak} days`, icon: Flame, trend: null, up: null },
                { label: useBangla ? 'মোট পয়েন্ট' : 'Total Points', value: profile.totalPoints, icon: Zap, trend: '+85', up: true },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    {stat.trend && (
                      <span className={cn(
                        'text-xs font-medium flex items-center gap-0.5',
                        stat.up ? 'text-success' : 'text-destructive'
                      )}>
                        {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Weekly Progress Chart */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                {useBangla ? 'সাপ্তাহিক অগ্রগতি' : 'Weekly Progress'}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgressData}>
                    <defs>
                      <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="questions" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorQuestions)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="correct" 
                      stroke="hsl(var(--success))" 
                      fill="transparent" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">{useBangla ? 'মোট প্রশ্ন' : 'Total'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">{useBangla ? 'সঠিক' : 'Correct'}</span>
                </div>
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                {useBangla ? 'বিষয়ভিত্তিক সময়' : 'Time by Subject'}
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studyTimeData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {studyTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {studyTimeData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                {useBangla ? 'মাসিক নির্ভুলতার প্রবণতা' : 'Monthly Accuracy Trend'}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Exam History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'সাম্প্রতিক পরীক্ষা' : 'Recent Exams'}
              </h3>
              <span className="text-xs text-muted-foreground">
                {examHistory.length} {useBangla ? 'টি পরীক্ষা' : 'exams'}
              </span>
            </div>

            {examHistory.map((exam, index) => {
              const percentage = Math.round((exam.score / exam.total) * 100);
              const isGood = percentage >= 75;
              const isOkay = percentage >= 50 && percentage < 75;
              
              return (
                <div
                  key={exam.id}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex flex-col items-center justify-center',
                    isGood ? 'bg-success/10' : isOkay ? 'bg-warning/10' : 'bg-destructive/10'
                  )}>
                    <span className={cn(
                      'text-lg font-bold',
                      isGood ? 'text-success' : isOkay ? 'text-warning' : 'text-destructive'
                    )}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{exam.subject}</h4>
                      <span className="text-xs text-muted-foreground">• {exam.topic}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{exam.score}/{exam.total}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exam.duration}
                      </span>
                      <span>•</span>
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        )}

        {/* Study Habits Tab */}
        {activeTab === 'habits' && (
          <div className="space-y-6 animate-fade-in">
            {/* Consistency Score */}
            <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {useBangla ? 'ধারাবাহিকতা স্কোর' : 'Consistency Score'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useBangla ? 'আপনার অধ্যয়ন নিয়মিততা' : 'Your study regularity'}
                  </p>
                </div>
                <div className="text-4xl font-bold text-primary">{consistencyScore}</div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${consistencyScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {consistencyScore >= 80 
                  ? (useBangla ? '🎉 চমৎকার! আপনি খুব নিয়মিত!' : '🎉 Excellent! You are very consistent!')
                  : (useBangla ? 'আরও নিয়মিত অধ্যয়ন করুন' : 'Try to study more regularly')}
              </p>
            </div>

            {/* Study Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {useBangla ? 'গড় অধ্যয়ন সময়' : 'Avg Study Time'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{avgStudyTime}</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'প্রতিদিন' : 'per day'}</p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {useBangla ? 'গড় প্রশ্ন' : 'Avg Questions'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{avgDailyQuestions}</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'প্রতিদিন' : 'per day'}</p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">
                    {useBangla ? 'সেরা সময়' : 'Peak Hours'}
                  </span>
                </div>
                <p className="text-lg font-bold text-foreground">{peakHours}</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'সবচেয়ে সক্রিয়' : 'Most active'}</p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    {useBangla ? 'সর্বোচ্চ স্ট্রিক' : 'Best Streak'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">14</p>
                <p className="text-xs text-muted-foreground">{useBangla ? 'দিন' : 'days'}</p>
              </div>
            </div>

            {/* Weekly Activity Heatmap */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                {useBangla ? 'সাপ্তাহিক কার্যকলাপ' : 'Weekly Activity'}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-muted-foreground mb-2">{day}</div>
                ))}
                {[...Array(28)].map((_, i) => {
                  const activity = Math.random();
                  return (
                    <div
                      key={i}
                      className={cn(
                        'aspect-square rounded-md',
                        activity > 0.75 ? 'bg-primary' :
                        activity > 0.5 ? 'bg-primary/60' :
                        activity > 0.25 ? 'bg-primary/30' :
                        'bg-muted'
                      )}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-xs text-muted-foreground">{useBangla ? 'কম' : 'Less'}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-primary/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/60" />
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{useBangla ? 'বেশি' : 'More'}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};