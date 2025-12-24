import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    
    if (isInstalled || wasDismissed) {
      return;
    }

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after a short delay for all users who haven't installed
    // This ensures the banner shows on iOS, desktop, and other browsers
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS - navigate to install page for instructions
      navigate('/install');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">Install Master-Moshai</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to home screen for faster access & offline use
            </p>
            <Button
              size="sm"
              onClick={handleInstall}
              className="mt-2 h-8 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Install Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
