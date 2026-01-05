import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Target, Clock, BookOpen, ChevronRight, Trophy, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface University {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  units: { id: string; name: string; nameBn: string; subjects: string[] }[];
  examPattern: string;
  examPatternBn: string;
  weightage: { subject: string; percentage: number }[];
  color: string;
}

const universities: University[] = [
  {
    id: 'du',
    name: 'Dhaka University',
    nameBn: 'ঢাকা বিশ্ববিদ্যালয়',
    icon: '🏛️',
    units: [
      { id: 'du-a', name: 'A Unit (Science)', nameBn: 'ক ইউনিট (বিজ্ঞান)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
      { id: 'du-b', name: 'B Unit (Arts)', nameBn: 'খ ইউনিট (মানবিক)', subjects: ['Bangla', 'English', 'General Knowledge'] },
      { id: 'du-c', name: 'C Unit (Commerce)', nameBn: 'গ ইউনিট (ব্যবসায়)', subjects: ['Accounting', 'Business', 'English'] },
      { id: 'du-d', name: 'D Unit (Science+Arts)', nameBn: 'ঘ ইউনিট', subjects: ['Mixed Subjects'] },
    ],
    examPattern: 'MCQ based, 1 hour exam, Negative marking (-0.25)',
    examPatternBn: 'MCQ ভিত্তিক, ১ ঘণ্টা পরীক্ষা, নেগেটিভ মার্কিং (-০.২৫)',
    weightage: [
      { subject: 'Physics', percentage: 25 },
      { subject: 'Chemistry', percentage: 25 },
      { subject: 'Mathematics', percentage: 25 },
      { subject: 'Biology/English', percentage: 25 },
    ],
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'buet',
    name: 'BUET',
    nameBn: 'বুয়েট',
    icon: '🔧',
    units: [
      { id: 'buet-eng', name: 'Engineering', nameBn: 'ইঞ্জিনিয়ারিং', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
      { id: 'buet-arch', name: 'Architecture', nameBn: 'স্থাপত্য', subjects: ['Physics', 'Mathematics', 'Drawing'] },
    ],
    examPattern: 'Written exam, 3 hours, Conceptual problems',
    examPatternBn: 'লিখিত পরীক্ষা, ৩ ঘণ্টা, ধারণাগত সমস্যা',
    weightage: [
      { subject: 'Mathematics', percentage: 40 },
      { subject: 'Physics', percentage: 35 },
      { subject: 'Chemistry', percentage: 25 },
    ],
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 'ruet',
    name: 'RUET',
    nameBn: 'রুয়েট',
    icon: '⚙️',
    units: [
      { id: 'ruet-eng', name: 'Engineering', nameBn: 'ইঞ্জিনিয়ারিং', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    ],
    examPattern: 'MCQ + Written, Combined exam',
    examPatternBn: 'MCQ + লিখিত, সম্মিলিত পরীক্ষা',
    weightage: [
      { subject: 'Mathematics', percentage: 35 },
      { subject: 'Physics', percentage: 35 },
      { subject: 'Chemistry', percentage: 30 },
    ],
    color: 'from-green-600 to-teal-600',
  },
  {
    id: 'cuet',
    name: 'CUET',
    nameBn: 'চুয়েট',
    icon: '🏗️',
    units: [
      { id: 'cuet-eng', name: 'Engineering', nameBn: 'ইঞ্জিনিয়ারিং', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    ],
    examPattern: 'MCQ based, Cluster admission',
    examPatternBn: 'MCQ ভিত্তিক, ক্লাস্টার ভর্তি',
    weightage: [
      { subject: 'Mathematics', percentage: 35 },
      { subject: 'Physics', percentage: 35 },
      { subject: 'Chemistry', percentage: 30 },
    ],
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'gst',
    name: 'GST (Cluster)',
    nameBn: 'জিএসটি (ক্লাস্টার)',
    icon: '🎓',
    units: [
      { id: 'gst-sci', name: 'Science', nameBn: 'বিজ্ঞান', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
      { id: 'gst-arts', name: 'Arts', nameBn: 'মানবিক', subjects: ['Bangla', 'English', 'General Knowledge'] },
      { id: 'gst-com', name: 'Commerce', nameBn: 'ব্যবসায়', subjects: ['Accounting', 'Business Studies'] },
    ],
    examPattern: 'MCQ based, 20 public universities',
    examPatternBn: 'MCQ ভিত্তিক, ২০টি পাবলিক বিশ্ববিদ্যালয়',
    weightage: [
      { subject: 'Subject Knowledge', percentage: 60 },
      { subject: 'General Knowledge', percentage: 20 },
      { subject: 'English', percentage: 20 },
    ],
    color: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'medical',
    name: 'Medical Admission',
    nameBn: 'মেডিকেল ভর্তি',
    icon: '⚕️',
    units: [
      { id: 'med', name: 'MBBS/BDS', nameBn: 'এমবিবিএস/বিডিএস', subjects: ['Biology', 'Chemistry', 'Physics', 'English', 'GK'] },
    ],
    examPattern: 'MCQ based, 100 marks, 1 hour',
    examPatternBn: 'MCQ ভিত্তিক, ১০০ নম্বর, ১ ঘণ্টা',
    weightage: [
      { subject: 'Biology', percentage: 30 },
      { subject: 'Chemistry', percentage: 25 },
      { subject: 'Physics', percentage: 20 },
      { subject: 'English', percentage: 15 },
      { subject: 'GK', percentage: 10 },
    ],
    color: 'from-red-600 to-rose-600',
  },
];

export const UniversityPrep: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {!selectedUniversity ? (
          <>
            {/* Hero */}
            <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {useBangla ? 'বিশ্ববিদ্যালয় প্রস্তুতি' : 'University Preparation'}
                  </h1>
                  <p className="text-muted-foreground">
                    {useBangla ? 'তোমার লক্ষ্য বিশ্ববিদ্যালয় বেছে নাও' : 'Choose your target university'}
                  </p>
                </div>
              </div>
            </div>

            {/* University Cards */}
            <div className="grid gap-4">
              {universities.map((uni, index) => (
                <button
                  key={uni.id}
                  onClick={() => setSelectedUniversity(uni)}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-all animate-slide-up text-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl",
                    uni.color
                  )}>
                    {uni.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? uni.nameBn : uni.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {uni.units.length} {useBangla ? 'টি ইউনিট' : 'units available'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* University Detail */}
            <Button 
              variant="ghost" 
              onClick={() => { setSelectedUniversity(null); setSelectedUnit(null); }}
              className="mb-4"
            >
              ← {useBangla ? 'ফিরে যাও' : 'Back'}
            </Button>

            {/* University Header */}
            <div className={cn(
              "rounded-2xl p-6 mb-6 bg-gradient-to-br text-white",
              selectedUniversity.color
            )}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{selectedUniversity.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold">
                    {useBangla ? selectedUniversity.nameBn : selectedUniversity.name}
                  </h1>
                  <p className="text-white/80">
                    {useBangla ? selectedUniversity.examPatternBn : selectedUniversity.examPattern}
                  </p>
                </div>
              </div>
            </div>

            {/* Unit Selection */}
            {!selectedUnit ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  {useBangla ? 'ইউনিট বেছে নাও' : 'Select Unit'}
                </h2>
                {selectedUniversity.units.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit.id)}
                    className="w-full glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary transition-all text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {useBangla ? unit.nameBn : unit.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {unit.subjects.join(', ')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              /* Preparation Dashboard */
              <div className="space-y-6">
                <Button variant="ghost" onClick={() => setSelectedUnit(null)} className="mb-2">
                  ← {useBangla ? 'ইউনিট পরিবর্তন' : 'Change Unit'}
                </Button>

                {/* Subject Weightage */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {useBangla ? 'বিষয়ভিত্তিক গুরুত্ব' : 'Subject Weightage'}
                  </h3>
                  <div className="space-y-3">
                    {selectedUniversity.weightage.map((w) => (
                      <div key={w.subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground">{w.subject}</span>
                          <span className="font-medium text-primary">{w.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${w.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/subjects')}
                    className="glass-card rounded-xl p-5 hover:border-primary transition-all"
                  >
                    <BookOpen className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? 'বিষয়ভিত্তিক অনুশীলন' : 'Subject Practice'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useBangla ? 'MCQ অনুশীলন' : 'MCQ Practice'}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/time-pressure')}
                    className="glass-card rounded-xl p-5 hover:border-primary transition-all"
                  >
                    <Clock className="w-8 h-8 text-warning mb-3" />
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? 'সময়ের চাপে পরীক্ষা' : 'Time Pressure Test'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useBangla ? 'মক টেস্ট' : 'Mock Tests'}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/weakness-heatmap')}
                    className="glass-card rounded-xl p-5 hover:border-primary transition-all"
                  >
                    <Flame className="w-8 h-8 text-destructive mb-3" />
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? 'দুর্বলতা বিশ্লেষণ' : 'Weakness Analysis'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useBangla ? 'হিটম্যাপ দেখো' : 'View Heatmap'}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="glass-card rounded-xl p-5 hover:border-primary transition-all"
                  >
                    <Trophy className="w-8 h-8 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground">
                      {useBangla ? 'প্রতিযোগী র‍্যাংক' : 'Competitor Rank'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useBangla ? 'তোমার অবস্থান' : 'Your Position'}
                    </p>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
