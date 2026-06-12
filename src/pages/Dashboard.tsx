import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { StatsCard } from '@/components/StatsCard';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { cn } from '@/lib/utils';
import { 
  Zap, Target, Trophy, TrendingUp, Sparkles, BookOpen, Bot, 
  GraduationCap, Clock, Brain, MessageCircle, Heart, Users,
  ChevronRight, Search, BarChart3, FileQuestion, Calendar, ListTodo
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  
  const dailyProgress = Math.min((profile.dailyProgress / profile.dailyGoal) * 100, 100);
  const accuracy = profile.questionsAnswered > 0 
    ? Math.round((profile.correctAnswers / profile.questionsAnswered) * 100) 
    : 0;
  
  const useBangla = profile.medium === 'bangla';
  const greeting = useBangla ? 'স্বাগতম' : 'Welcome back';
  const subjects = getSubjectsByLevel(profile.level);

  const quickActions = [
    {
      id: 'learn',
      title: useBangla ? 'পড়াশোনা শুরু করুন' : 'Start Learning',
      subtitle: useBangla ? 'বিষয় ভিত্তিক অধ্যায়' : 'Subject chapters',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      path: '/learn'
    },
    {
      id: 'ai-tutor',
      title: useBangla ? 'AI মাস্টার' : 'AI Master',
      subtitle: useBangla ? 'প্রশ্ন করুন' : 'Ask anything',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      path: '/ai-chat'
    },
    {
      id: 'practice',
      title: useBangla ? 'কুইজ অনুশীলন' : 'Quiz Practice',
      subtitle: useBangla ? 'MCQ অনুশীলন' : 'MCQ practice',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      path: '/subjects'
    },
    {
      id: 'admission',
      title: useBangla ? 'ভর্তি প্রস্তুতি' : 'University Prep',
      subtitle: useBangla ? 'DU, BUET, মেডিকেল' : 'DU, BUET, Medical',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      path: '/university-prep'
    }
  ];

  const learningModes = [
    {
      id: 'self-study',
      title: useBangla ? 'নিজে পড়ুন' : 'Study by Yourself',
      description: useBangla 
        ? 'গঠনমূলক পাঠ + পরীক্ষা + ব্যক্তিগত প্রতিক্রিয়া'
        : 'Structured lessons + exam + personalized feedback',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'ai-master',
      title: useBangla ? 'AI মাস্টারের সাথে' : 'Study with AI Master',
      description: useBangla 
        ? 'যেকোনো সময় প্রশ্ন করুন, তাৎক্ষণিক ব্যাখ্যা পান'
        : 'Ask questions anytime, get instant explanations',
      icon: Bot,
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'board-questions',
      title: useBangla ? 'বোর্ড প্রশ্ন বিশ্লেষণ' : 'Board Question Analysis',
      description: useBangla 
        ? 'MCQ ও সৃজনশীল প্রশ্ন বিস্তারিত প্রতিক্রিয়া সহ'
        : 'MCQ & creative questions with detailed feedback',
      icon: FileQuestion,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const tools = [
    { 
      id: 'calendar', 
      title: useBangla ? 'ক্যালেন্ডার' : 'Calendar', 
      icon: Calendar, 
      path: '/calendar',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'todo', 
      title: useBangla ? 'টু-ডু লিস্ট' : 'To-Do List', 
      icon: ListTodo, 
      path: '/todo',
      color: 'from-violet-500 to-purple-600'
    },
    { 
      id: 'analytics', 
      title: useBangla ? 'বিশ্লেষণ' : 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      color: 'from-emerald-500 to-teal-600'
    },
  ];

  const features = [
    { 
      id: 'weakness', 
      title: useBangla ? 'দুর্বলতা হিটম্যাপ' : 'Weakness Heatmap', 
      icon: BarChart3, 
      path: '/weakness-heatmap',
      badge: useBangla ? 'গুরুত্বপূর্ণ' : 'Important'
    },
    { 
      id: 'planner', 
      title: useBangla ? 'AI স্টাডি প্ল্যানার' : 'AI Study Planner', 
      icon: Clock, 
      path: '/study-planner',
      badge: 'AI'
    },
    { 
      id: 'doubt', 
      title: useBangla ? 'ডাউট সলভার' : 'Smart Doubt Resolver', 
      icon: MessageCircle, 
      path: '/doubt-resolver',
      badge: '24/7'
    },
    { 
      id: 'mental', 
      title: useBangla ? 'মানসিক সহায়তা' : 'Mental Support', 
      icon: Heart, 
      path: '/mental-support',
      badge: null
    },
    { 
      id: 'time-pressure', 
      title: useBangla ? 'টাইম প্রেশার ট্রেনিং' : 'Time Pressure Training', 
      icon: Clock, 
      path: '/time-pressure',
      badge: null
    },
    { 
      id: 'answer-check', 
      title: useBangla ? 'উত্তর যাচাই' : 'Answer Checking', 
      icon: FileQuestion, 
      path: '/answer-checker',
      badge: useBangla ? 'বোর্ড স্টাইল' : 'Board Style'
    },
    { 
      id: 'cq-exam', 
      title: useBangla ? 'সৃজনশীল পরীক্ষা (CQ)' : 'Creative Question Exam', 
      icon: FileQuestion, 
      path: '/cq-exam',
      badge: useBangla ? 'OCR' : 'OCR'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PWAInstallBanner />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {profile.name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {useBangla ? 'আজ কিছু নতুন শিখি!' : "Let's learn something new today!"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 animate-slide-up">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={useBangla ? 'বিষয় বা অধ্যায় খুঁজুন...' : 'Search topics or chapters...'}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            onClick={() => navigate('/learn')}
            readOnly
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className={cn(
                'p-4 rounded-2xl border border-border bg-card text-left',
                'hover:border-primary/50 hover:shadow-lg transition-all duration-300',
                'animate-slide-up group'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br mb-3',
                'group-hover:scale-110 transition-transform',
                action.color
              )}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-0.5">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Daily Goal Card */}
        <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-5">
            <ProgressRing progress={dailyProgress} size={80} strokeWidth={8}>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{profile.dailyProgress}</p>
                <p className="text-[10px] text-muted-foreground">/{profile.dailyGoal}</p>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground text-sm">
                  {useBangla ? 'দৈনিক লক্ষ্য' : 'Daily Goal'}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {dailyProgress >= 100 
                  ? (useBangla ? '🎉 লক্ষ্য সম্পন্ন!' : '🎉 Goal completed!')
                  : (useBangla 
                      ? `আরো ${profile.dailyGoal - profile.dailyProgress}টি প্রশ্ন` 
                      : `${profile.dailyGoal - profile.dailyProgress} more questions`)}
              </p>
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => navigate('/subjects')}
                className="h-8 text-xs"
              >
                <Sparkles className="w-3 h-3" />
                {useBangla ? 'অনুশীলন শুরু' : 'Start Practice'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="font-bold text-foreground">{profile.totalPoints}</p>
            <p className="text-[10px] text-muted-foreground">{useBangla ? 'পয়েন্ট' : 'Points'}</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="font-bold text-foreground">{accuracy}%</p>
            <p className="text-[10px] text-muted-foreground">{useBangla ? 'নির্ভুলতা' : 'Accuracy'}</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="font-bold text-foreground">{profile.questionsAnswered}</p>
            <p className="text-[10px] text-muted-foreground">{useBangla ? 'উত্তর' : 'Answered'}</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-warning" />
            <p className="font-bold text-foreground">{profile.badges.length}</p>
            <p className="text-[10px] text-muted-foreground">{useBangla ? 'ব্যাজ' : 'Badges'}</p>
          </div>
        </div>

        {/* Tools Section - Calendar, Todo, Analytics */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">
            {useBangla ? 'টুলস' : 'Tools'}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className={cn(
                  'p-4 rounded-xl border border-border bg-card text-center',
                  'hover:border-primary/50 hover:shadow-lg transition-all duration-300',
                  'animate-slide-up group'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br mx-auto mb-2',
                  'group-hover:scale-110 transition-transform',
                  tool.color
                )}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-medium text-foreground text-xs">{tool.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Modes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">
              {useBangla ? 'শেখার পদ্ধতি' : 'Learning Modes'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
              {useBangla ? 'সব দেখুন' : 'View All'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {learningModes.map((mode, index) => (
              <button
                key={mode.id}
                onClick={() => navigate('/learn')}
                className={cn(
                  'w-full p-4 rounded-xl border border-border bg-card text-left',
                  'hover:border-primary/50 transition-all duration-300',
                  'flex items-center gap-4 animate-slide-up group'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                  'group-hover:scale-110 transition-transform',
                  mode.color
                )}>
                  <mode.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{mode.title}</h3>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-4">
            {useBangla ? 'বিশেষ ফিচার' : 'Special Features'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className={cn(
                  'p-4 rounded-xl border border-border bg-card text-left',
                  'hover:border-primary/50 hover:bg-primary/5 transition-all duration-300',
                  'flex items-start gap-3 animate-slide-up group relative'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <feature.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate pr-6">{feature.title}</h3>
                </div>
                {feature.badge && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    {feature.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Weak Topics Alert */}
        {profile.weakTopics.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  {useBangla ? 'ফোকাস এরিয়া' : 'Focus Areas'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {useBangla ? 'এই টপিকগুলো অনুশীলন করুন: ' : 'Practice these topics: '}
                  {profile.weakTopics.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Dashboard Link */}
        <button
          onClick={() => navigate('/guardian-dashboard')}
          className="w-full p-4 rounded-xl border border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-left flex items-center gap-4 animate-slide-up mb-6"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">
              {useBangla ? 'অভিভাবক ড্যাশবোর্ড' : 'Guardian Dashboard'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {useBangla ? 'অভিভাবকদের জন্য প্রগ্রেস ট্র্যাকিং' : 'Progress tracking for parents'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </main>
    </div>
  );
};
