'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadSimple, X, Monitor, DeviceMobile } from '@phosphor-icons/react';

// Storage keys
const PWA_INSTALLED_KEY = 'quickreply_pwa_installed';
const PWA_DISMISSED_KEY = 'quickreply_pwa_dismissed_until';

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check display-mode standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar or prompt from showing
      e.preventDefault();
      
      // Store the event so it can be triggered later
      setDeferredPrompt(e);

      // If beforeinstallprompt fires, it means the app is not currently installed.
      // Reset the local storage installation flag in case the user previously uninstalled it.
      localStorage.removeItem(PWA_INSTALLED_KEY);

      // Check localStorage cooldown
      const dismissedUntil = localStorage.getItem(PWA_DISMISSED_KEY);
      if (dismissedUntil) {
        const dismissedTime = parseInt(dismissedUntil, 10);
        if (!isNaN(dismissedTime) && Date.now() < dismissedTime) {
          // Cooldown active, don't show prompt
          return;
        }
      }

      // Show banner if not installed and not within cooldown
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isMounted]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Trigger prompt
    await deferredPrompt.prompt();

    // Wait for the user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      setShowBanner(false);
    } else {
      // If user cancels, set 8 hour cooldown
      const cooldownTime = Date.now() + 8 * 60 * 60 * 1000;
      localStorage.setItem(PWA_DISMISSED_KEY, cooldownTime.toString());
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismissClick = () => {
    // 8 hour cooldown
    const cooldownTime = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem(PWA_DISMISSED_KEY, cooldownTime.toString());
    setShowBanner(false);
  };

  if (!isMounted || !showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-md bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-slate-800 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 z-[200] flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF4D3D]/10 rounded-xl flex items-center justify-center text-[#FF4D3D] shadow-inner shrink-0">
                <DownloadSimple weight="bold" size={24} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-[16px] text-gray-800 dark:text-white leading-tight">
                  Install QuickReply
                </h3>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Save response snippets on your home screen.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismissClick}
              aria-label="Dismiss banner"
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X weight="bold" size={16} />
            </button>
          </div>

          {/* Benefits list (compact) */}
          <div className="flex flex-col gap-1.5 text-[12px] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100/50 dark:border-slate-800/40">
            <div className="flex items-center gap-2">
              <DeviceMobile size={14} className="text-[#FF4D3D]" />
              <span>Standalone screen with zero browser bars</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor size={14} className="text-[#FF4D3D]" />
              <span>Instantly access from desktop/dock</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDismissClick}
              className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-[13px] font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all active:scale-95 text-center cursor-pointer"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 bg-[#FF4D3D] hover:bg-[#E63E2E] text-[13px] font-bold text-white rounded-xl shadow-md shadow-[#FF4D3D]/10 hover:shadow-[#FF4D3D]/20 transition-all active:scale-95 text-center cursor-pointer"
            >
              Install App
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
