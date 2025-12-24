import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/context/PWAContext';

export const PWAInstallBanner: React.FC = () => {
  const navigate = useNavigate();
  const { deferredPrompt, triggerInstall, showBanner, dismissBanner, isInstalled } = usePWA();

  const handleInstall = async () => {
    if (deferredPrompt) {
      await triggerInstall();
    } else {
      // iOS - navigate to install page for instructions
      navigate('/install');
    }
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
        <button
          onClick={dismissBanner}
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
