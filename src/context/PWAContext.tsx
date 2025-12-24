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
    // Check if running in standalone mode (Android/desktop) or iOS standalone
    const checkInstalled = () => {
      const isStandaloneDisplay = window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;
      const isIosStandalone = (navigator as any).standalone === true;
      return isStandaloneDisplay || isIosStandalone;
    };

    setIsInstalled(checkInstalled());

    // Listen for display mode changes (install/uninstall)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches || (navigator as any).standalone === true);
      if (!e.matches) {
        // App was uninstalled, reset state
        setDeferredPrompt(null);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Fired when the install actually completes
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstalled(false); // If we get this event, app is not installed

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
      if (!checkInstalled() && !wasDismissed) {
        setShowBanner(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        // Don't mark installed yet — wait for the real `appinstalled` / display-mode change.
        setShowBanner(false);
        setDeferredPrompt(null);
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
