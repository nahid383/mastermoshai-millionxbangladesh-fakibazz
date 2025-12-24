import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel, sampleNotes, Note, Subject } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Clock, ChevronRight, Trophy, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Get notes for selected subject
  const availableNotes = selectedSubject 
    ? sampleNotes.filter(n => n.subjectId === selectedSubject.id)
    : [];

  // Check if note has been read
  const isNoteRead = (noteId: string) => profile.readNotes?.includes(noteId) ?? false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              {useBangla ? 'শিখুন' : 'Learn'}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {useBangla 
              ? 'নোট পড়ুন, XP উপার্জন করুন এবং সারপ্রাইজ টেস্ট দিন!' 
              : 'Read notes, earn XP, and take surprise tests!'}
          </p>
        </div>

        {/* XP Banner */}
        <div className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'নোট পড়ে XP উপার্জন করুন!' : 'Earn XP by Reading Notes!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {useBangla 
                  ? 'প্রতিটি নোট পড়ার পর সারপ্রাইজ টেস্ট দিন এবং বোনাস পয়েন্ট পান' 
                  : 'Complete surprise tests after reading to earn bonus points'}
              </p>
            </div>
          </div>
        </div>

        {!selectedSubject ? (
          // Subject Selection
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {useBangla ? 'বিষয় নির্বাচন করুন' : 'Select a Subject'}
            </h2>
            {subjects.slice(0, 6).map((subject, index) => {
              const subjectNotes = sampleNotes.filter(n => n.subjectId === subject.id);
              const readCount = subjectNotes.filter(n => isNoteRead(n.id)).length;
              
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 border-border bg-card',
                    'hover:border-primary/50 hover:bg-primary/5 transition-all',
                    'flex items-center gap-4 text-left animate-slide-up'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    'bg-gradient-to-br shadow-md',
                    subject.color
                  )}>
                    {subject.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? subject.nameBn : subject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subjectNotes.length > 0 
                        ? `${readCount}/${subjectNotes.length} ${useBangla ? 'নোট পড়া হয়েছে' : 'notes read'}`
                        : useBangla ? 'শীঘ্রই আসছে' : 'Coming soon'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        ) : (
          // Notes List
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubject(null)}
              className="mb-4"
            >
              ← {useBangla ? 'ফিরে যান' : 'Back'}
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                'bg-gradient-to-br shadow-md',
                selectedSubject.color
              )}>
                {selectedSubject.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {useBangla ? selectedSubject.nameBn : selectedSubject.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {availableNotes.length} {useBangla ? 'টি নোট উপলব্ধ' : 'notes available'}
                </p>
              </div>
            </div>

            {availableNotes.length > 0 ? (
              <div className="space-y-3">
                {availableNotes.map((note, index) => {
                  const read = isNoteRead(note.id);
                  return (
                    <button
                      key={note.id}
                      onClick={() => navigate(`/learn/${note.id}`)}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all',
                        'flex items-center gap-4 animate-slide-up',
                        read 
                          ? 'border-success/30 bg-success/5' 
                          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        read ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'
                      )}>
                        {read ? <Trophy className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {useBangla && note.titleBn ? note.titleBn : note.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {note.readTime} min
                          </span>
                          <span className="flex items-center gap-1 text-xs text-primary font-medium">
                            <Sparkles className="w-3 h-3" />
                            +{note.xpReward} XP
                          </span>
                          {read && (
                            <span className="text-xs text-success font-medium">
                              ✓ {useBangla ? 'সম্পন্ন' : 'Completed'}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {useBangla ? 'নোট শীঘ্রই আসছে!' : 'Notes Coming Soon!'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {useBangla 
                    ? 'এই বিষয়ের জন্য নোট প্রস্তুত করা হচ্ছে' 
                    : 'Notes for this subject are being prepared'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
