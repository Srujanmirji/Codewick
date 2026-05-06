"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !isInstallable) return null;

  return (
    <div className="p-4 mt-2">
      <button
        onClick={handleInstall}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
          "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-cyan-400 font-bold text-sm",
          "hover:from-cyan-500/30 hover:to-indigo-500/30 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,213,238,0.15)]"
        )}
      >
        <Smartphone className="w-5 h-5 animate-bounce" />
        <span>Install SkillSwap App</span>
      </button>
    </div>
  );
}
