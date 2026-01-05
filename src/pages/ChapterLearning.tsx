import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LearningPathCard } from '@/components/LearningPathCard';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, Topic } from '@/lib/data';
import { ArrowLeft, BookOpen, Bot, FileQuestion, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChapterLearning: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const subjects = getSubjectsByLevel(profile.level);
  const subject = subjects.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {useBangla ? 'অধ্যায় পাওয়া যায়নি' : 'Chapter not found'}
          </h1>
          <Button onClick={() => navigate('/learn')}>
            {useBangla ? 'ফিরে যান' : 'Go Back'}
          </Button>
        </div>
      </div>
    );
  }

  const learningPaths = [
    {
      id: 'self-study',
      title: 'Study by Yourself',
      titleBn: 'নিজে নিজে পড়ুন',
      description: 'Read structured notes and take a test. Get personalized feedback on your weak areas.',
      descriptionBn: 'গঠনমূলক নোট পড়ুন এবং পরীক্ষা দিন। আপনার দুর্বল এলাকাগুলোতে ব্যক্তিগত প্রতিক্রিয়া পান।',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'XP +50',
      badgeBn: 'XP +৫০',
      path: `/learn/self-study/${subjectId}/${topicId}`
    },
    {
      id: 'ai-master',
      title: 'Study with AI Master',
      titleBn: 'AI মাস্টারের সাথে পড়ুন',
      description: 'Ask questions freely and get instant, clear explanations from your AI teacher.',
      descriptionBn: 'স্বাধীনভাবে প্রশ্ন করুন এবং আপনার AI শিক্ষকের কাছ থেকে তাৎক্ষণিক, স্পষ্ট ব্যাখ্যা পান।',
      icon: Bot,
      gradient: 'from-violet-500 to-purple-600',
      badge: 'AI Powered',
      badgeBn: 'AI চালিত',
      path: `/learn/ai-master/${subjectId}/${topicId}`
    },
    {
      id: 'board-questions',
      title: 'Board Question Analysis',
      titleBn: 'বোর্ড প্রশ্ন বিশ্লেষণ',
      description: 'Practice MCQ and Creative questions from previous board exams with detailed feedback.',
      descriptionBn: 'বিস্তারিত প্রতিক্রিয়া সহ পূর্ববর্তী বোর্ড পরীক্ষার MCQ এবং সৃজনশীল প্রশ্ন অনুশীলন করুন।',
      icon: FileQuestion,
      gradient: 'from-orange-500 to-red-600',
      badge: 'Board Prep',
      badgeBn: 'বোর্ড প্রস্তুতি',
      path: `/learn/board-questions/${subjectId}/${topicId}`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/learn/subject/${subjectId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground truncate">
                {useBangla ? topic.nameBn : topic.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {useBangla ? subject.nameBn : subject.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <div className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4',
            'bg-gradient-to-br shadow-xl',
            subject.color
          )}>
            {subject.icon}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {useBangla ? topic.nameBn : topic.name}
          </h2>
          <p className="text-muted-foreground">
            {useBangla 
              ? 'আপনার শেখার পথ বেছে নিন' 
              : 'Choose your learning path'}
          </p>
        </div>

        {/* Learning Path Cards */}
        <div className="space-y-4">
          {learningPaths.map((path, index) => (
            <div 
              key={path.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LearningPathCard
                title={path.title}
                titleBn={path.titleBn}
                description={path.description}
                descriptionBn={path.descriptionBn}
                icon={path.icon}
                gradient={path.gradient}
                useBangla={useBangla}
                onClick={() => navigate(path.path)}
                badge={path.badge}
                badgeBn={path.badgeBn}
              />
            </div>
          ))}
        </div>

        {/* Difficulty Badge */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium',
            topic.difficulty === 'easy' && 'bg-success/10 text-success',
            topic.difficulty === 'medium' && 'bg-warning/10 text-warning',
            topic.difficulty === 'hard' && 'bg-destructive/10 text-destructive'
          )}>
            {useBangla 
              ? (topic.difficulty === 'easy' ? 'সহজ' : topic.difficulty === 'medium' ? 'মাঝারি' : 'কঠিন')
              : topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {useBangla ? 'ব্লুম স্তর: ' : 'Bloom Level: '}
            {topic.bloomLevel.charAt(0).toUpperCase() + topic.bloomLevel.slice(1)}
          </span>
        </div>
      </main>
    </div>
  );
};
