import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  canInstall: boolean;
  triggerInstall: () => Promise<boolean>;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  dismissBanner: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    const installed = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(installed);

    if (installed) return;

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner if not dismissed this session
      const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed-session');
      if (!wasDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after a short delay for iOS/other browsers
    const timer = setTimeout(() => {
      const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed-session');
      if (!window.matchMedia('(display-mode: standalone)').matches && !wasDismissed) {
        setShowBanner(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
        return true;
      }
      return false;
    }
    return false;
  };

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed-session', 'true');
  };

  const canInstall = !!deferredPrompt || !isInstalled;

  return (
    <PWAContext.Provider value={{
      deferredPrompt,
      isInstalled,
      canInstall,
      triggerInstall,
      showBanner,
      setShowBanner,
      dismissBanner,
    }}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
