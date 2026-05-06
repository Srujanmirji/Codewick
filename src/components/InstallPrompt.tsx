"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
    
    // Check if Mobile
    const isMobileDevice = /android|webos|blackberry|iemobile|opera mini/.test(userAgent);
    setIsMobile(isMobileDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
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

  if (isInstalled) return null;

  // iOS Safari Fallback (Always show on iOS)
  if (isIOS) {
    return (
      <div className="p-4 mt-2 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <p className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-2">
          <Smartphone size={14} /> iOS Installation
        </p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Tap <span className="font-bold text-blue-600">Share</span> then <span className="font-bold text-blue-600">"Add to Home Screen"</span> to install.
        </p>
      </div>
    );
  }

  // For Android/Chrome/Other Mobile browsers

  if (isMobile || isInstallable) {
    return (
      <div className="p-4 mt-2">
        <button
          onClick={handleInstall}
          disabled={!isInstallable && !isIOS}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
            isInstallable 
              ? "bg-[#3B82F6] text-white font-bold text-sm shadow-lg shadow-blue-500/30 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          )}
        >
          {isInstallable ? <Download className="w-5 h-5" /> : <Smartphone className="w-5 h-5 opacity-50" />}
          <span>{isInstallable ? "Install App" : "App Ready to Install"}</span>
        </button>
        {!isInstallable && !isIOS && (
          <p className="text-[10px] text-center text-gray-400 mt-2">
            Waiting for browser to enable installation...
          </p>
        )}
      </div>
    );
  }

  return null;
}
