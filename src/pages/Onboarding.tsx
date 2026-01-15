import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChevronRight, BookOpen, GraduationCap, Globe, Target, Zap, Brain, Users } from 'lucide-react';

type Step = 'welcome' | 'purpose' | 'name' | 'level' | 'stream' | 'medium';
type Purpose = 'learning' | 'exam' | 'admission';
type Stream = 'science' | 'commerce' | 'arts';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile, setIsOnboarded } = useStudent();
  const [step, setStep] = useState<Step>('welcome');
  const [purpose, setPurpose] = useState<Purpose>('learning');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'ssc' | 'hsc' | 'admission'>('ssc');
  const [stream, setStream] = useState<Stream>('science');
  const [medium, setMedium] = useState<'bangla' | 'english'>('english');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && step !== 'welcome') {
      navigate('/auth');
    }
  }, [user, step, navigate]);

  const handleComplete = () => {
    const finalLevel = level === 'admission' ? 'hsc' : level;
    updateProfile({ 
      name, 
      level: finalLevel, 
      medium,
      targetUniversity: level === 'admission' ? 'pending' : undefined
    });
    setIsOnboarded(true);
    navigate('/dashboard');
  };

  const getNextStep = () => {
    if (step === 'purpose') return 'name';
    if (step === 'name') return 'level';
    if (step === 'level') {
      // Skip stream for SSC or if admission
      if (level === 'ssc' || level === 'admission') return 'medium';
      return 'stream';
    }
    if (step === 'stream') return 'medium';
    return 'medium';
  };

  const getStepCount = () => {
    const baseSteps = ['purpose', 'name', 'level', 'medium'];
    if (level === 'hsc' && purpose !== 'admission') {
      return [...baseSteps.slice(0, 3), 'stream', 'medium'];
    }
    return baseSteps;
  };

  const stepOrder = getStepCount();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-6xl shadow-glow animate-float">
                🎓
              </div>
              <h1 className="text-4xl font-bold mb-3">
                <span className="gradient-text">Master-Moshai</span>
              </h1>
              <p className="text-xl text-foreground/80 mb-2">
                Your AI Learning Companion
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed px-4">
                Personalized learning for SSC, HSC & University Admission. Practice smart, learn faster, and ace your exams!
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: '📚', label: 'Smart Notes' },
                  { icon: '🤖', label: 'AI Tutor' },
                  { icon: '📊', label: 'Track Progress' },
                ].map((feature) => (
                  <div key={feature.label} className="p-3 rounded-xl bg-card border border-border">
                    <div className="text-2xl mb-1">{feature.icon}</div>
                    <p className="text-xs text-muted-foreground">{feature.label}</p>
                  </div>
                ))}
              </div>

              <Button
                variant="hero"
                size="xl"
                onClick={() => user ? setStep('purpose') : navigate('/auth')}
                className="w-full"
              >
                {user ? 'Get Started' : 'Sign In to Start'}
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <Link to="/auth" className="text-primary hover:underline font-medium">
                    Create one
                  </Link>
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-6">
                🇧🇩 Made by Team Fakibazz
              </p>
            </div>
          )}

          {/* Purpose Step */}
          {step === 'purpose' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What brings you here?</h2>
                <p className="text-muted-foreground">Choose your learning goal</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    value: 'learning', 
                    label: 'Regular Learning', 
                    sublabel: 'Study subjects at my own pace',
                    icon: BookOpen,
                    color: 'from-emerald-500 to-teal-600'
                  },
                  { 
                    value: 'exam', 
                    label: 'Exam Preparation', 
                    sublabel: 'SSC/HSC board exam focused',
                    icon: Brain,
                    color: 'from-violet-500 to-purple-600'
                  },
                  { 
                    value: 'admission', 
                    label: 'University Admission', 
                    sublabel: 'DU, BUET, Medical & more',
                    icon: GraduationCap,
                    color: 'from-orange-500 to-red-600'
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPurpose(option.value as Purpose);
                      if (option.value === 'admission') {
                        setLevel('admission');
                      }
                    }}
                    className={cn(
                      'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
                      'flex items-center gap-4',
                      purpose === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                      option.color
                    )}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep('name')}
                className="w-full mt-6"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Name Step */}
          {step === 'name' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
                <p className="text-muted-foreground">Let's personalize your experience</p>
              </div>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-14 px-5 rounded-xl border-2 border-border bg-card text-foreground text-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                autoFocus
              />
              
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep('level')}
                disabled={!name.trim()}
                className="w-full mt-6"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Level Step */}
          {step === 'level' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Hi, {name}! 👋</h2>
                <p className="text-muted-foreground">
                  {purpose === 'admission' 
                    ? 'Select your current education level'
                    : 'What are you preparing for?'}
                </p>
              </div>
              
              <div className="space-y-3">
                {purpose === 'admission' ? (
                  // Admission specific options
                  [
                    { value: 'admission', label: 'HSC Complete / Appearing', sublabel: 'Ready for university admission', icon: '🎯' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLevel(option.value as 'ssc' | 'hsc' | 'admission')}
                      className={cn(
                        'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
                        'flex items-center gap-4',
                        level === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                      )}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  // Regular learning/exam options
                  [
                    { value: 'ssc', label: 'SSC', sublabel: 'Secondary School Certificate', icon: '🎓' },
                    { value: 'hsc', label: 'HSC', sublabel: 'Higher Secondary Certificate', icon: '🏆' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLevel(option.value as 'ssc' | 'hsc' | 'admission')}
                      className={cn(
                        'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
                        'flex items-center gap-4',
                        level === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                      )}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep(getNextStep())}
                className="w-full mt-6"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Stream Step (HSC only) */}
          {step === 'stream' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Stream</h2>
                <p className="text-muted-foreground">Select your academic stream</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'science', label: 'Science', sublabel: 'Physics, Chemistry, Biology, Math', icon: '🔬' },
                  { value: 'commerce', label: 'Commerce', sublabel: 'Accounting, Finance, Economics', icon: '📊' },
                  { value: 'arts', label: 'Arts/Humanities', sublabel: 'Literature, History, Geography', icon: '📖' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStream(option.value as Stream)}
                    className={cn(
                      'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
                      'flex items-center gap-4',
                      stream === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep('medium')}
                className="w-full mt-6"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Medium Step */}
          {step === 'medium' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Preferred Language</h2>
                <p className="text-muted-foreground">Choose your medium of instruction</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'english', label: 'English Medium', sublabel: 'Questions and explanations in English', icon: '🌐' },
                  { value: 'bangla', label: 'বাংলা মাধ্যম', sublabel: 'প্রশ্ন ও ব্যাখ্যা বাংলায়', icon: '🇧🇩' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMedium(option.value as 'bangla' | 'english')}
                    className={cn(
                      'w-full p-5 rounded-xl border-2 text-left transition-all duration-200',
                      'flex items-center gap-4',
                      medium === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <Button
                variant="hero"
                size="lg"
                onClick={handleComplete}
                className="w-full mt-6"
              >
                Start Learning! 🚀
              </Button>
            </div>
          )}

          {/* Progress dots */}
          {step !== 'welcome' && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {stepOrder.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    step === s ? 'w-6 bg-primary' : 
                    stepOrder.indexOf(step) > i ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
