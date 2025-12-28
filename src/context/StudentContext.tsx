import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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

const coerceLevel = (value: unknown): 'ssc' | 'hsc' => (value === 'hsc' ? 'hsc' : 'ssc');
const coerceMedium = (value: unknown): 'bangla' | 'english' => (value === 'bangla' ? 'bangla' : 'english');

const normalizeBadges = (raw: unknown): Badge[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((b: any) => {
      const id = typeof b?.id === 'string' ? b.id : '';
      const name = typeof b?.name === 'string' ? b.name : '';
      const description = typeof b?.description === 'string' ? b.description : '';
      const icon = typeof b?.icon === 'string' ? b.icon : '';

      const earnedAtRaw = b?.earnedAt;
      const earnedAt = earnedAtRaw ? new Date(earnedAtRaw) : undefined;

      return {
        id,
        name,
        description,
        icon,
        earnedAt: earnedAt instanceof Date && !Number.isNaN(earnedAt.getTime()) ? earnedAt : undefined,
      };
    })
    .filter((b) => b.id);
};

const serializeBadgesForDb = (list: Badge[]) =>
  list.map((b) => ({
    ...b,
    earnedAt: b.earnedAt ? new Date(b.earnedAt).toISOString() : undefined,
  }));

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('studentProfile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('isOnboarded') === 'true';
  });

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [backendLoaded, setBackendLoaded] = useState(false);

  const hasShownSyncError = useRef(false);

  // Persist locally (offline-friendly)
  useEffect(() => {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('isOnboarded', isOnboarded.toString());
  }, [isOnboarded]);

  // Track auth user (so we can sync progress to backend)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load saved progress from backend when user logs in
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setBackendLoaded(false);

      // Not logged in: keep local-only behavior
      if (!authUser) {
        setBackendLoaded(true);
        return;
      }

      // Seed from auth metadata if local profile is empty
      const metaName = (authUser.user_metadata as any)?.name as string | undefined;
      if (metaName && !profile.name) {
        setProfile((p) => ({ ...p, name: metaName }));
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        if (!hasShownSyncError.current) {
          hasShownSyncError.current = true;
          toast({
            title: 'Sync problem',
            description: 'Could not load your saved progress. Your progress will be saved locally for now.',
            variant: 'destructive',
          });
        }
        setBackendLoaded(true);
        return;
      }

      if (data) {
        const nameFromDb = typeof data.name === 'string' ? data.name.trim() : '';
        if (nameFromDb) {
          setIsOnboarded(true);
        }

        setProfile((prev) => ({
          ...prev,
          id: data.id ?? prev.id,
          name: data.name ?? prev.name,
          level: coerceLevel(data.level ?? prev.level),
          medium: coerceMedium(data.medium ?? prev.medium),
          institution: (data as any).institution ?? prev.institution,
          admissionYear: (data as any).admission_year ?? prev.admissionYear,
          targetUniversity: (data as any).target_university ?? prev.targetUniversity,
          targetDepartment: (data as any).target_department ?? prev.targetDepartment,
          examDate: (data as any).exam_date ?? prev.examDate,
          avatarUrl: (data as any).avatar_url ?? prev.avatarUrl,
          streak: data.streak ?? 0,
          totalPoints: data.total_points ?? 0,
          questionsAnswered: data.questions_answered ?? 0,
          correctAnswers: data.correct_answers ?? 0,
          dailyProgress: data.daily_progress ?? 0,
          weakTopics: data.weak_topics ?? [],
          strongTopics: data.strong_topics ?? [],
          badges: normalizeBadges(data.badges),
        }));
      }

      setBackendLoaded(true);
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  // Save progress to backend (debounced) whenever it changes
  useEffect(() => {
    if (!authUser || !backendLoaded) return;

    const timer = window.setTimeout(async () => {
      const meta = authUser.user_metadata as any;

      const payload = {
        user_id: authUser.id,
        name: profile.name || (typeof meta?.name === 'string' ? meta.name : null),
        level: profile.level,
        medium: profile.medium,
        streak: profile.streak,
        total_points: profile.totalPoints,
        questions_answered: profile.questionsAnswered,
        correct_answers: profile.correctAnswers,
        daily_progress: profile.dailyProgress,
        weak_topics: profile.weakTopics,
        strong_topics: profile.strongTopics,
        badges: serializeBadgesForDb(profile.badges),
        institution: profile.institution || (typeof meta?.institution === 'string' ? meta.institution : null),
        admission_year: profile.admissionYear || null,
        target_university: profile.targetUniversity || null,
        target_department: profile.targetDepartment || null,
        exam_date: profile.examDate || null,
        location: typeof meta?.location === 'string' ? meta.location : null,
        avatar_url: profile.avatarUrl || null,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' });

      if (error && !hasShownSyncError.current) {
        hasShownSyncError.current = true;
        toast({
          title: 'Sync problem',
          description: 'Could not save your progress to the server. Your progress is still saved locally.',
          variant: 'destructive',
        });
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [authUser, backendLoaded, profile]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addPoints = (points: number) => {
    setProfile((prev) => {
      const newTotal = prev.totalPoints + points;
      const newProfile = { ...prev, totalPoints: newTotal };

      // Check for point-based badges
      if (newTotal >= 100 && !prev.badges.find((b) => b.id === 'points_100')) {
        const badge = badges.find((b) => b.id === 'points_100');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newTotal >= 500 && !prev.badges.find((b) => b.id === 'points_500')) {
        const badge = badges.find((b) => b.id === 'points_500');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newTotal >= 1000 && !prev.badges.find((b) => b.id === 'points_1000')) {
        const badge = badges.find((b) => b.id === 'points_1000');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }

      return newProfile;
    });
  };

  const recordAnswer = (correct: boolean, topicId: string) => {
    setProfile((prev) => {
      const newAnswered = prev.questionsAnswered + 1;
      const newCorrect = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newDailyProgress = prev.dailyProgress + 1;

      let newWeak = [...prev.weakTopics];
      let newStrong = [...prev.strongTopics];

      if (correct) {
        // Remove from weak if it was there
        newWeak = newWeak.filter((t) => t !== topicId);
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
        newStrong = newStrong.filter((t) => t !== topicId);
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
      if (newAnswered === 1 && !prev.badges.find((b) => b.id === 'first_quiz')) {
        const badge = badges.find((b) => b.id === 'first_quiz');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }

      return newProfile;
    });
  };

  const incrementStreak = () => {
    setProfile((prev) => {
      const newStreak = prev.streak + 1;
      const newProfile = { ...prev, streak: newStreak };

      // Check for streak badges
      if (newStreak >= 3 && !prev.badges.find((b) => b.id === 'streak_3')) {
        const badge = badges.find((b) => b.id === 'streak_3');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }
      if (newStreak >= 7 && !prev.badges.find((b) => b.id === 'streak_7')) {
        const badge = badges.find((b) => b.id === 'streak_7');
        if (badge) {
          newProfile.badges = [...prev.badges, { ...badge, earnedAt: new Date() }];
        }
      }

      return newProfile;
    });
  };

  const resetDailyProgress = () => {
    setProfile((prev) => ({ ...prev, dailyProgress: 0 }));
  };

  const earnBadge = (badgeId: string) => {
    setProfile((prev) => {
      if (prev.badges.find((b) => b.id === badgeId)) return prev;

      const badge = badges.find((b) => b.id === badgeId);
      if (!badge) return prev;

      return {
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date() }],
      };
    });
  };

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      addPoints,
      recordAnswer,
      incrementStreak,
      resetDailyProgress,
      earnBadge,
      isOnboarded,
      setIsOnboarded,
    }),
    [profile, isOnboarded],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
