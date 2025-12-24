import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SubjectCard } from '@/components/SubjectCard';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';

export const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {useBangla ? 'সকল বিষয়' : 'All Subjects'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {useBangla 
              ? `${profile.level.toUpperCase()} - যেকোনো বিষয় বেছে নিন` 
              : `${profile.level.toUpperCase()} - Choose any subject to practice`}
          </p>
        </div>

        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              useBangla={useBangla}
              onClick={() => navigate(`/quiz/${subject.id}`)}
              progress={Math.floor(Math.random() * 80)}
              delay={index * 50}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
