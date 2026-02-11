import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        if (isInstalled) {
            setShowInstallButton(false);
            return;
        }

        // Listen for beforeinstallprompt event (Android/Desktop)
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, show install button if not installed
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && !isInstalled) {
            setShowInstallButton(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // iOS - show instructions
            alert('To install:\n1. Tap the Share button\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
            return;
        }

        // Android/Desktop - trigger install
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallButton(false);
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstallButton(false);
        sessionStorage.setItem('install-prompt-dismissed', 'true');
    };

    if (!showInstallButton) return null;

    return (
        <div className="fixed top-16 left-4 right-4 z-40 animate-in slide-in-from-top duration-300 md:hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 shadow-lg backdrop-blur-sm flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Download className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold">Install SpotFunnel</p>
                    <p className="text-[10px] text-muted-foreground">Add to Home Screen for quick access</p>
                </div>
                <Button size="sm" onClick={handleInstall} className="text-xs h-7">
                    Install
                </Button>
                <button onClick={handleDismiss} className="p-1 hover:bg-muted rounded-full">
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
