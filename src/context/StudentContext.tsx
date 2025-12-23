import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentProfile, defaultProfile, Badge, badges } from '@/lib/data';

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addPoints: (points: number) => void;
  recordAnswer: (correct: boolean, topicId: string) => void;
  incrementStreak: () => void;
  resetDailyProgress: () => void;
  earnBadge: (badgeId: string) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('studentProfile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('isOnboarded') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('isOnboarded', isOnboarded.toString());
  }, [isOnboarded]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addPoints = (points: number) => {
    setProfile(prev => {
      const newTotal = prev.totalPoints + points;
      const newProfile = { ...prev, totalPoints: newTotal };
      
      // Check for point-based badges
      if (newTotal >= 100 && !prev.badges.find(b => b.id === 'points_100')) {
        const badge = badges.find(b => b.id === 'points_100');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newTotal >= 500 && !prev.badges.find(b => b.id === 'points_500')) {
        const badge = badges.find(b => b.id === 'points_500');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newTotal >= 1000 && !prev.badges.find(b => b.id === 'points_1000')) {
        const badge = badges.find(b => b.id === 'points_1000');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      
      return newProfile;
    });
  };

  const recordAnswer = (correct: boolean, topicId: string) => {
    setProfile(prev => {
      const newAnswered = prev.questionsAnswered + 1;
      const newCorrect = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newDailyProgress = prev.dailyProgress + 1;
      
      let newWeak = [...prev.weakTopics];
      let newStrong = [...prev.strongTopics];
      
      if (correct) {
        // Remove from weak if it was there
        newWeak = newWeak.filter(t => t !== topicId);
        // Add to strong if answered correctly multiple times (simplified)
        if (!newStrong.includes(topicId)) {
          newStrong.push(topicId);
        }
      } else {
        // Add to weak topics
        if (!newWeak.includes(topicId)) {
          newWeak.push(topicId);
        }
        // Remove from strong if it was there
        newStrong = newStrong.filter(t => t !== topicId);
      }
      
      const newProfile: StudentProfile = {
        ...prev,
        questionsAnswered: newAnswered,
        correctAnswers: newCorrect,
        dailyProgress: newDailyProgress,
        weakTopics: newWeak,
        strongTopics: newStrong,
      };
      
      // Check for first quiz badge
      if (newAnswered === 1 && !prev.badges.find(b => b.id === 'first_quiz')) {
        const badge = badges.find(b => b.id === 'first_quiz');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      
      return newProfile;
    });
  };

  const incrementStreak = () => {
    setProfile(prev => {
      const newStreak = prev.streak + 1;
      const newProfile = { ...prev, streak: newStreak };
      
      // Check for streak badges
      if (newStreak >= 3 && !prev.badges.find(b => b.id === 'streak_3')) {
        const badge = badges.find(b => b.id === 'streak_3');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newStreak >= 7 && !prev.badges.find(b => b.id === 'streak_7')) {
        const badge = badges.find(b => b.id === 'streak_7');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      
      return newProfile;
    });
  };

  const resetDailyProgress = () => {
    setProfile(prev => ({ ...prev, dailyProgress: 0 }));
  };

  const earnBadge = (badgeId: string) => {
    setProfile(prev => {
      if (prev.badges.find(b => b.id === badgeId)) return prev;
      
      const badge = badges.find(b => b.id === badgeId);
      if (!badge) return prev;
      
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date() }],
      };
    });
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        updateProfile,
        addPoints,
        recordAnswer,
        incrementStreak,
        resetDailyProgress,
        earnBadge,
        isOnboarded,
        setIsOnboarded,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
