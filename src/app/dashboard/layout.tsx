"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/ui/Toast";

import { useUserStore } from "@/store/useUserStore";
import { toast } from "@/store/useToastStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useUserStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = "https://stream.mux.com/r6pXRAJb3005XEEbl1hYU1x01RFJDSn7KQApwNGgAHHbU.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn("Video playback failed:", err);
        }
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, playVideo);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", playVideo);
      return () => {
        video.removeEventListener("loadedmetadata", playVideo);
      };
    }
  }, [hlsUrl]);

  // Onboarding guard
  useEffect(() => {
    if (status === "authenticated" && !(session?.user as any)?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [status, session, router]);

  // Sync user data (with retry for intermittent Railway DB connection)
  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    const fetchUser = async (retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        if (cancelled) return;
        try {
          const res = await fetch('/api/wallet');
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          const realUser = {
            id: (session?.user as any)?.id || '1',
            name: session?.user?.name || 'User',
            email: session?.user?.email || '',
            avatarUrl: session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`,
            credits: data.credits ?? 0,
            trustScore: data.trustScore ?? 50,
            trustLevel: (data.trustScore ?? 50) >= 90 ? 'Elite' : (data.trustScore ?? 50) >= 75 ? 'Trusted' : (data.trustScore ?? 50) >= 50 ? 'Verified' : 'Newbie',
            completionRate: 100,
          };
          // @ts-ignore
          setUser(realUser);
          return; // success — stop retrying
        } catch (error) {
          if (attempt < retries) {
            console.warn(`User sync attempt ${attempt}/${retries} failed, retrying in 3s...`);
            await new Promise(r => setTimeout(r, 3000));
          } else {
            console.warn("User sync failed after retries. Using session-only data.");
            // Fallback: set user from session data only (no wallet/trust info)
            // @ts-ignore
            setUser({
              id: (session?.user as any)?.id || '1',
              name: session?.user?.name || 'User',
              email: session?.user?.email || '',
              avatarUrl: session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`,
              credits: 0,
              trustScore: 50,
              trustLevel: 'Newbie',
              completionRate: 100,
            });
          }
        }
      }
    };

    fetchUser();

    return () => { cancelled = true; };
  }, [setUser, session, status]);

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen pointer-events-none"
      />

      <div className="z-10 flex h-full w-full p-6 gap-6">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden gap-6">
          <Navbar />
          <main className="flex-1 overflow-y-auto pb-12 custom-scrollbar pr-4">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
