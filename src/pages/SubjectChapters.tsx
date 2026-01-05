import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { ArrowLeft, ChevronRight, BookOpen, Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SubjectChapters: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const subjects = getSubjectsByLevel(profile.level);
  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {useBangla ? 'বিষয় পাওয়া যায়নি' : 'Subject not found'}
          </h1>
          <Button onClick={() => navigate('/learn')}>
            {useBangla ? 'ফিরে যান' : 'Go Back'}
          </Button>
        </div>
      </div>
    );
  }

  // Simulate chapter completion status (in real app, this would come from user data)
  const getChapterStatus = (topicId: string) => {
    const completedTopics = profile.strongTopics || [];
    if (completedTopics.includes(topicId)) return 'completed';
    return 'available';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/learn')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                'bg-gradient-to-br shadow-md',
                subject.color
              )}>
                {subject.icon}
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? subject.nameBn : subject.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {subject.topics.length} {useBangla ? 'টি অধ্যায়' : 'chapters'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Subject Banner */}
        <div className={cn(
          'rounded-2xl p-6 mb-6 bg-gradient-to-br text-white animate-fade-in',
          subject.color
        )}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{subject.icon}</div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {useBangla ? subject.nameBn : subject.name}
              </h2>
              <p className="text-white/80 text-sm">
                {useBangla 
                  ? 'প্রতিটি অধ্যায়ে ৩টি শেখার পথ আছে'
                  : 'Each chapter has 3 learning paths'}
              </p>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {useBangla ? 'অধ্যায়সমূহ' : 'Chapters'}
          </h3>
          
          {subject.topics.map((topic, index) => {
            const status = getChapterStatus(topic.id);
            const isCompleted = status === 'completed';
            
            return (
              <button
                key={topic.id}
                onClick={() => navigate(`/learn/chapter/${subjectId}/${topic.id}`)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  'flex items-center gap-4 animate-slide-up group',
                  isCompleted 
                    ? 'border-success/30 bg-success/5'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Chapter Number */}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                  isCompleted 
                    ? 'bg-success/20 text-success'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                )}>
                  {isCompleted ? <Trophy className="w-6 h-6" /> : index + 1}
                </div>
                
                {/* Chapter Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {useBangla ? topic.nameBn : topic.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      topic.difficulty === 'easy' && 'bg-success/10 text-success',
                      topic.difficulty === 'medium' && 'bg-warning/10 text-warning',
                      topic.difficulty === 'hard' && 'bg-destructive/10 text-destructive'
                    )}>
                      {useBangla 
                        ? (topic.difficulty === 'easy' ? 'সহজ' : topic.difficulty === 'medium' ? 'মাঝারি' : 'কঠিন')
                        : topic.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-xs text-success font-medium">
                        ✓ {useBangla ? 'সম্পন্ন' : 'Completed'}
                      </span>
                    )}
                  </div>
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
