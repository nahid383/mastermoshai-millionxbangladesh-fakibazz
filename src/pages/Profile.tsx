import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { usePWA } from '@/context/PWAContext';
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
  Users,
  School,
  Calendar,
  Target,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
import { AvatarUpload } from '@/components/AvatarUpload';

const InstallAppButton: React.FC = () => {
  const navigate = useNavigate();
  const { deferredPrompt, triggerInstall, setShowBanner } = usePWA();

  // Check if currently running in standalone mode (opened from home screen)
  const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const success = await triggerInstall();
      if (!success) {
        setShowBanner(true);
      }
    } else {
      // iOS or no prompt available - go to install page
      navigate('/install');
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="w-full flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Download className="w-5 h-5 text-primary" />
        <div className="text-left">
          <p className="font-medium text-foreground">
            {isRunningStandalone ? 'Reinstall App' : 'Install App'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isRunningStandalone 
              ? 'View installation instructions' 
              : 'Add to home screen for quick access'}
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const { profile, updateProfile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const isDark = resolvedTheme === 'dark';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editLevel, setEditLevel] = useState(profile.level);
  const [editMedium, setEditMedium] = useState(profile.medium);
  
  // Admission fields
  const [editInstitution, setEditInstitution] = useState(profile.institution || '');
  const [editAdmissionYear, setEditAdmissionYear] = useState(profile.admissionYear || '');
  const [editTargetUniversity, setEditTargetUniversity] = useState(profile.targetUniversity || '');
  const [editTargetDepartment, setEditTargetDepartment] = useState(profile.targetDepartment || '');
  const [editExamDate, setEditExamDate] = useState(profile.examDate || '');

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!editProfileOpen) return;
    setEditName(profile.name);
    setEditLevel(profile.level);
    setEditMedium(profile.medium);
    setEditInstitution(profile.institution || '');
    setEditAdmissionYear(profile.admissionYear || '');
    setEditTargetUniversity(profile.targetUniversity || '');
    setEditTargetDepartment(profile.targetDepartment || '');
    setEditExamDate(profile.examDate || '');
  }, [editProfileOpen, profile]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been logged out successfully.' });
    navigate('/auth');
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      level: editLevel,
      medium: editMedium,
      institution: editInstitution,
      admissionYear: editAdmissionYear,
      targetUniversity: editTargetUniversity,
      targetDepartment: editTargetDepartment,
      examDate: editExamDate,
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
            <AvatarUpload
              currentAvatarUrl={profile.avatarUrl}
              userName={profile.name}
              onUploadSuccess={(url) => updateProfile({ avatarUrl: url })}
              size="lg"
            />
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
              <p className="font-medium text-destructive">Sign Out</p>
              <p className="text-xs text-muted-foreground">Log out without losing your profile</p>
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
          <p className="mt-1">MillionX Bangladesh AI Buildathon 2026</p>
        </div>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription className="sr-only">
                Change theme and notification preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Daily reminder alerts</p>
                  </div>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
              <InstallAppButton />
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{useBangla ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}</DialogTitle>
              <DialogDescription className="sr-only">Update your name and preferences.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{useBangla ? 'নাম' : 'Name'}</Label>
                <Input 
                  id="name" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={useBangla ? 'আপনার নাম লিখুন' : 'Enter your name'}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{useBangla ? 'স্তর' : 'Level'}</Label>
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
                <Label>{useBangla ? 'মাধ্যম' : 'Medium'}</Label>
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

              <Separator className="my-4" />
              
              {/* Admission Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <School className="w-5 h-5" />
                  <h3 className="font-semibold">{useBangla ? 'ভর্তি তথ্য' : 'Admission Info'}</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">{useBangla ? 'প্রতিষ্ঠানের নাম' : 'Institution Name'}</Label>
                  <Input 
                    id="institution" 
                    value={editInstitution} 
                    onChange={(e) => setEditInstitution(e.target.value)}
                    placeholder={useBangla ? 'স্কুল/কলেজের নাম' : 'School/College name'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionYear">{useBangla ? 'ভর্তির বছর' : 'Admission Year'}</Label>
                  <Input 
                    id="admissionYear" 
                    value={editAdmissionYear} 
                    onChange={(e) => setEditAdmissionYear(e.target.value)}
                    placeholder={useBangla ? 'যেমন: 2026' : 'e.g., 2026'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetUniversity">{useBangla ? 'লক্ষ্য বিশ্ববিদ্যালয়' : 'Target University'}</Label>
                  <Input 
                    id="targetUniversity" 
                    value={editTargetUniversity} 
                    onChange={(e) => setEditTargetUniversity(e.target.value)}
                    placeholder={useBangla ? 'যেমন: ঢাকা বিশ্ববিদ্যালয়' : 'e.g., Dhaka University'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDepartment">{useBangla ? 'লক্ষ্য বিভাগ' : 'Target Department'}</Label>
                  <Input 
                    id="targetDepartment" 
                    value={editTargetDepartment} 
                    onChange={(e) => setEditTargetDepartment(e.target.value)}
                    placeholder={useBangla ? 'যেমন: কম্পিউটার সায়েন্স' : 'e.g., Computer Science'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examDate">{useBangla ? 'পরীক্ষার তারিখ' : 'Exam Date'}</Label>
                  <Input 
                    id="examDate" 
                    type="date"
                    value={editExamDate} 
                    onChange={(e) => setEditExamDate(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full mt-4">
                {useBangla ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
