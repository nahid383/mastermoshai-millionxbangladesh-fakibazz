import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/hooks/useAuth';
import { badges as allBadges } from '@/lib/data';
import { 
  User, 
  GraduationCap, 
  Globe, 
  Flame, 
  Zap,
  Trophy,
  Settings,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Check,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { profile, setIsOnboarded, updateProfile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editLevel, setEditLevel] = useState(profile.level);
  const [editMedium, setEditMedium] = useState(profile.medium);

  const handleLogout = async () => {
    await signOut();
    setIsOnboarded(false);
    updateProfile({
      name: '',
      streak: 0,
      totalPoints: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      weakTopics: [],
      strongTopics: [],
      dailyProgress: 0,
      badges: [],
    });
    toast({ title: 'Signed out', description: 'You have been logged out successfully.' });
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      level: editLevel,
      medium: editMedium,
    });
    setEditProfileOpen(false);
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-glow">
              👨‍🎓
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{profile.name || 'Student'}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile.level.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{profile.medium === 'english' ? 'English' : 'বাংলা'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-warning mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.totalPoints}</span>
              </div>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-accent mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.badges.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-foreground mb-4">
            {useBangla ? 'ব্যাজ সংগ্রহ' : 'Badges Collection'}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const earned = profile.badges.find(b => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all',
                    earned 
                      ? 'bg-accent/10 border-2 border-accent/30' 
                      : 'bg-muted/50 opacity-40 grayscale'
                  )}
                  title={badge.description}
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="text-[10px] text-center text-muted-foreground line-clamp-2">
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">Settings</p>
              <p className="text-xs text-muted-foreground">Customize your learning experience</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setEditProfileOpen(true)}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your name and preferences</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-destructive">Reset Progress</p>
              <p className="text-xs text-muted-foreground">Start fresh with a new profile</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Meet Our Team */}
        <button
          onClick={() => navigate('/team')}
          className="w-full glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors mt-2 animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Meet Our Team</p>
            <p className="text-xs text-muted-foreground">Team Fakibazz behind Master-Moshai</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* App Info */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p className="font-medium">Master-Moshai v1.0</p>
          <p className="mt-1">Made with ❤️ by Team Fakibazz</p>
          <p className="mt-1">MillionX Bangladesh AI Buildathon 2024</p>
        </div>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Daily reminder alerts</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['ssc', 'hsc'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEditLevel(level as 'ssc' | 'hsc')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2',
                        editLevel === level 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="font-medium">{level.toUpperCase()}</span>
                      {editLevel === level && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medium</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'english', label: 'English' },
                    { value: 'bangla', label: 'বাংলা' }
                  ].map((medium) => (
                    <button
                      key={medium.value}
                      onClick={() => setEditMedium(medium.value as 'english' | 'bangla')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2',
                        editMedium === medium.value 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="font-medium">{medium.label}</span>
                      {editMedium === medium.value && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full mt-4">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
