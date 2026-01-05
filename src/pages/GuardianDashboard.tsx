import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Users, TrendingUp, BookOpen, Trophy, Clock, AlertTriangle, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LinkedStudent {
  id: string;
  name: string;
  level: string;
  institution?: string;
  totalPoints: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  weakTopics: string[];
  strongTopics: string[];
}

export const GuardianDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<LinkedStudent | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if user has guardian role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'guardian')
        .single();
      
      if (roleData) {
        setIsAuthenticated(true);
        fetchLinkedStudents(user.id);
      }
    }
    setIsLoading(false);
  };

  const fetchLinkedStudents = async (guardianId: string) => {
    // In production, this would fetch from guardian_links and profiles tables
    // For demo, using mock data
    setLinkedStudents([
      {
        id: '1',
        name: 'Ahmed Rahman',
        level: 'hsc',
        institution: 'Dhaka College',
        totalPoints: 2450,
        questionsAnswered: 342,
        correctAnswers: 275,
        streak: 12,
        weakTopics: ['Calculus', 'Organic Chemistry'],
        strongTopics: ['Physics', 'English'],
      },
    ]);
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/guardian`,
          },
        });
        if (error) throw error;
        
        // Add guardian role
        if (data.user) {
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'guardian',
          });
        }
        
        toast.success('Account created! Please check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        setIsAuthenticated(true);
        checkAuth();
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLinkedStudents([]);
    setSelectedStudent(null);
  };

  const linkStudent = async () => {
    if (!studentCode.trim()) return;
    toast.success('Student link request sent!');
    setStudentCode('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Guardian Dashboard</h1>
            <p className="text-muted-foreground">Monitor your child's learning progress</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            />
            <Button variant="hero" className="w-full" onClick={handleAuth} disabled={isLoading}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedStudent) {
    const accuracy = selectedStudent.questionsAnswered > 0 
      ? Math.round((selectedStudent.correctAnswers / selectedStudent.questionsAnswered) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
          <div className="container max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setSelectedStudent(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Students
            </button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="container max-w-4xl mx-auto px-4 py-6">
          {/* Student Header */}
          <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl text-white font-bold">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{selectedStudent.name}</h1>
                <p className="text-muted-foreground">
                  {selectedStudent.level.toUpperCase()} • {selectedStudent.institution}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card rounded-xl p-4">
              <TrendingUp className="w-6 h-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{selectedStudent.totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <Trophy className="w-6 h-6 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <BookOpen className="w-6 h-6 text-success mb-2" />
              <p className="text-2xl font-bold text-foreground">{selectedStudent.questionsAnswered}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <Clock className="w-6 h-6 text-warning mb-2" />
              <p className="text-2xl font-bold text-foreground">{selectedStudent.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>

          {/* Weak Topics Alert */}
          {selectedStudent.weakTopics.length > 0 && (
            <div className="glass-card rounded-xl p-5 mb-6 bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Needs Attention</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Weak in: {selectedStudent.weakTopics.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Strong Topics */}
          {selectedStudent.strongTopics.length > 0 && (
            <div className="glass-card rounded-xl p-5 bg-success/5 border-success/20">
              <h3 className="font-semibold text-foreground mb-2">Strong Topics</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.strongTopics.map((topic) => (
                  <span 
                    key={topic}
                    className="px-3 py-1 rounded-full bg-success/20 text-success text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Guardian Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Link Student */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Link a Student
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter student code"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={linkStudent}>Link</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask your child for their student code from their profile page.
          </p>
        </div>

        {/* Linked Students */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Students</h2>
        
        {linkedStudents.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No students linked</h3>
            <p className="text-sm text-muted-foreground">
              Link a student using their code to start monitoring their progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {linkedStudents.map((student) => {
              const accuracy = student.questionsAnswered > 0 
                ? Math.round((student.correctAnswers / student.questionsAnswered) * 100)
                : 0;
              
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="w-full glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg text-white font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.level.toUpperCase()} • {accuracy}% accuracy • {student.streak} day streak
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
