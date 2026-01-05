import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleNotes } from '@/lib/data';
import { BookOpen, ChevronRight, Sparkles, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);

  // Calculate progress for each subject
  const getSubjectProgress = (subjectId: string) => {
    const subjectNotes = sampleNotes.filter(n => n.subjectId === subjectId);
    const readCount = subjectNotes.filter(n => profile.readNotes?.includes(n.id)).length;
    const totalTopics = subjects.find(s => s.id === subjectId)?.topics.length || 0;
    return { readCount, total: totalTopics };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'শিখুন' : 'Learn'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {useBangla 
                  ? 'প্রতিটি অধ্যায়ে ৩টি শেখার পথ' 
                  : '3 learning paths for each chapter'}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Paths Banner */}
        <div className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-background">
                <BookOpen className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border-2 border-background">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-background">
                <span className="text-sm">📝</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">
                {useBangla ? '৩টি শেখার পথ' : '3 Learning Paths'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {useBangla 
                  ? 'নিজে পড়ুন • AI মাস্টার • বোর্ড প্রশ্ন' 
                  : 'Self Study • AI Master • Board Questions'}
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {useBangla ? 'বিষয় নির্বাচন করুন' : 'Select a Subject'}
          </h2>
          
          {subjects.slice(0, 8).map((subject, index) => {
            const progress = getSubjectProgress(subject.id);
            const progressPercent = progress.total > 0 
              ? Math.round((progress.readCount / progress.total) * 100) 
              : 0;
            
            return (
              <button
                key={subject.id}
                onClick={() => navigate(`/learn/subject/${subject.id}`)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 border-border bg-card',
                  'hover:border-primary/50 hover:bg-primary/5 transition-all',
                  'flex items-center gap-4 text-left animate-slide-up group'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                  'bg-gradient-to-br shadow-md group-hover:scale-110 transition-transform',
                  subject.color
                )}>
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {useBangla ? subject.nameBn : subject.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {subject.topics.length} {useBangla ? 'টি অধ্যায়' : 'chapters'}
                    </span>
                    {progressPercent > 0 && (
                      <span className="text-xs text-primary font-medium">
                        {progressPercent}% {useBangla ? 'সম্পন্ন' : 'done'}
                      </span>
                    )}
                  </div>
                  {/* Progress Bar */}
                  {progressPercent > 0 && (
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
