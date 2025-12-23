import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowLeft, Loader2, MapPin, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional signup fields
  const [educationLevel, setEducationLevel] = useState<'ssc' | 'hsc' | 'admission'>('ssc');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) navigate('/');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: err.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!isLogin && !name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name,
              education_level: educationLevel,
              institution,
              location,
            },
          },
        });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'Welcome to Master-Moshai!' });
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message?.includes('User already registered')) {
        message = 'This email is already registered. Please login instead.';
      }
      toast({
        title: 'Authentication Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-glow">
            🎓
          </div>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Master-Moshai</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Phone login is coming soon.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-scale-in max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="আপনার নাম / Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Education Level *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'ssc', label: 'SSC', icon: '📚' },
                      { value: 'hsc', label: 'HSC', icon: '🎓' },
                      { value: 'admission', label: 'Admission', icon: '🏆' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setEducationLevel(option.value as 'ssc' | 'hsc' | 'admission')}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center transition-all',
                          educationLevel === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50',
                        )}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <p className="text-xs font-medium mt-1">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">
                    {educationLevel === 'admission' ? 'Target University' : 'School/College Name'}
                  </Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="institution"
                      type="text"
                      placeholder={educationLevel === 'admission' ? 'e.g., Dhaka University' : 'e.g., Dhaka College'}
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., Dhaka, Chittagong, Sylhet"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4" />
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && <p className="text-xs text-muted-foreground">At least 6 characters</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait...
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-primary">
              {isLogin ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to Team Fakibazz's Terms of Service
        </p>
      </div>
    </div>
  );
};
