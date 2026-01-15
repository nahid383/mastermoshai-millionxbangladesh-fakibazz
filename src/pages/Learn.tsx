import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleNotes } from '@/lib/data';
import { BookOpen, ChevronRight, Sparkles, GraduationCap, Search, Bot, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const [searchQuery, setSearchQuery] = useState('');
  
  const subjects = getSubjectsByLevel(profile.level);

  // Calculate progress for each subject
  const getSubjectProgress = (subjectId: string) => {
    const subjectNotes = sampleNotes.filter(n => n.subjectId === subjectId);
    const readCount = subjectNotes.filter(n => profile.readNotes?.includes(n.id)).length;
    const totalTopics = subjects.find(s => s.id === subjectId)?.topics.length || 0;
    return { readCount, total: totalTopics };
  };

  // Filter subjects/topics based on search
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const query = searchQuery.toLowerCase();
    return subjects.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.nameBn.includes(searchQuery) ||
      s.topics.some(t => t.name.toLowerCase().includes(query) || t.nameBn.includes(searchQuery))
    );
  }, [subjects, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'শিখুন' : 'Learn'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {useBangla ? 'বিষয় ভিত্তিক অধ্যায়, নোট ও মাইন্ড ম্যাপ' : 'Subject chapters, notes & mind maps'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={useBangla ? 'বিষয় বা অধ্যায় খুঁজুন...' : 'Search topics or chapters...'}
              className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Learning Modes Banner */}
        <div className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
          <h3 className="font-semibold text-foreground text-sm mb-3">
            {useBangla ? 'প্রতিটি অধ্যায়ে ৩টি শেখার পথ' : '3 Learning Modes Per Chapter'}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-foreground">{useBangla ? 'নিজে পড়ুন' : 'Self Study'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/10">
              <Bot className="w-4 h-4 text-violet-500" />
              <span className="text-xs text-foreground">{useBangla ? 'AI মাস্টার' : 'AI Master'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
              <FileQuestion className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-foreground">{useBangla ? 'বোর্ড প্রশ্ন' : 'Board Q'}</span>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {useBangla ? 'বিষয় নির্বাচন করুন' : 'Select a Subject'}
          </h2>
          
          {filteredSubjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {useBangla ? 'কোন বিষয় পাওয়া যায়নি' : 'No subjects found'}
            </p>
          ) : (
            filteredSubjects.map((subject, index) => {
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
            })
          )}
        </div>
      </main>
    </div>
  );
};
