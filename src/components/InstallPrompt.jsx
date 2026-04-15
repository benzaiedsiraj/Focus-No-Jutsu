import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * InstallPrompt — Detects the `beforeinstallprompt` event and shows a sleek
 * "Install App" banner. Auto-hides if the app is already installed (standalone mode).
 */
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Slight delay for a smooth entrance after page load
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't render if installed, dismissed, or no prompt available
  if (isInstalled || !showBanner || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] animate-slide-up"
      style={{ width: 'min(420px, calc(100vw - 2rem))' }}
    >
      <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(220,38,38,0.1)] p-4 flex items-center gap-4">
        
        {/* Red accent glow */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>

        {/* Icon */}
        <div className="flex-none w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <Smartphone size={20} strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white tracking-tight leading-tight">
            Install Focus No Jutsu
          </p>
          <p className="text-[0.7rem] font-medium text-slate-400 mt-0.5 leading-snug">
            Add to home screen for offline timer & quick access
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-none">
          <button
            onClick={handleInstall}
            disabled={installing}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_8px_25px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {installing ? (
              <div className="w-3.5 h-3.5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={14} strokeWidth={3} />
            )}
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200"
            aria-label="Dismiss install prompt"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
