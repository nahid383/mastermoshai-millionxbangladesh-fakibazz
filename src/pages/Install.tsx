import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, CheckCircle, ArrowLeft, Share, ExternalLink, Copy, Link } from 'lucide-react';
import { usePWA } from '@/context/PWAContext';
import { useToast } from '@/hooks/use-toast';

// Direct app install link (published URL)
const APP_URL = 'https://9a8aa4c7-a5fb-450a-bee2-0aa98d5ae7bc.lovableproject.com';

export const Install: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deferredPrompt, triggerInstall } = usePWA();

  const isRunningStandalone =
    (window.matchMedia?.('(display-mode: standalone)')?.matches ?? false) ||
    (navigator as any).standalone === true;

  // Check if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Install prompts do NOT work when the app is embedded (e.g. inside the Lovable preview iframe)
  const isEmbedded = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      toast({ title: 'Link copied!', description: 'Open this link in Chrome or Edge to install.' });
    } catch {
      toast({ title: 'Copy failed', description: APP_URL, variant: 'destructive' });
    }
  };

  const handleOpenInBrowser = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  const handleInstall = async () => {
    const success = await triggerInstall();
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Install Master-Moshai</CardTitle>
          <CardDescription>
            Get the full app experience on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Direct Install Link - Always visible */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Link className="w-4 h-4" />
              <span>Direct Install Link</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Open this link in <strong>Chrome</strong> or <strong>Edge</strong> browser, then tap "Install" from the menu.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={() => window.open(APP_URL, '_blank')} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Link
              </Button>
            </div>
          </div>

          {isRunningStandalone ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                App is already installed! Open it from your home screen.
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <p className="font-medium text-sm">To install on iPhone/iPad:</p>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">1</span>
                    <span>Tap the <Share className="inline w-4 h-4" /> Share button in Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">2</span>
                    <span>Scroll down and tap "Add to Home Screen"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">3</span>
                    <span>Tap "Add" to confirm</span>
                  </li>
                </ol>
              </div>
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Works offline
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Faster loading
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Home screen access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Full screen experience
                </li>
              </ul>
              <Button onClick={handleInstall} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
              <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
                Maybe Later
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Use the link above to open the app in your browser, then install from the browser menu (⋮ → Install app).
              </p>
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
