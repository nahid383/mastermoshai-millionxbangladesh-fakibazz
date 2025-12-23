import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChevronRight, BookOpen, GraduationCap, Globe, LogIn } from 'lucide-react';

type Step = 'welcome' | 'name' | 'level' | 'medium';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile, setIsOnboarded } = useStudent();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'ssc' | 'hsc'>('ssc');
  const [medium, setMedium] = useState<'bangla' | 'english'>('english');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && step !== 'welcome') {
      navigate('/auth');
    }
  }, [user, step, navigate]);

  const handleComplete = () => {
    updateProfile({ name, level, medium });
    setIsOnboarded(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl shadow-glow animate-float">
                🎓
              </div>
              <h1 className="text-3xl font-bold mb-3">
                <span className="gradient-text">Master-Moshai</span>
              </h1>
              <p className="text-lg text-foreground/80 mb-2">
                Your AI Learning Companion
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Personalized learning for SSC & HSC students. Practice smart, learn faster, and ace your exams!
              </p>
              <Button
                variant="hero"
                size="xl"
                onClick={() => user ? setStep('name') : navigate('/auth')}
                className="w-full"
              >
                {user ? 'Get Started' : 'Sign In to Start'}
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <Link to="/auth" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-6">
                🇧🇩 Made by Team Fakibazz
              </p>
            </div>
          )}

          {/* Name Step */}
          {step === 'name' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
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
                <p className="text-muted-foreground">What are you preparing for?</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'ssc', label: 'SSC', sublabel: 'Secondary School Certificate', icon: '🎓' },
                  { value: 'hsc', label: 'HSC', sublabel: 'Higher Secondary Certificate', icon: '🏆' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLevel(option.value as 'ssc' | 'hsc')}
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
              {['name', 'level', 'medium'].map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    step === s ? 'w-6 bg-primary' : 
                    ['name', 'level', 'medium'].indexOf(step) > i ? 'bg-primary' : 'bg-muted'
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
