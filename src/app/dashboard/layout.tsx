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

  // Sync user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/wallet');
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const mockUser = {
          id: '1',
          name: session?.user?.name || 'Alex Developer',
          email: session?.user?.email || 'alex@skillswap.local',
          avatarUrl: session?.user?.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          credits: data.credits,
          trustScore: data.trustScore,
          trustLevel: data.trustScore >= 90 ? 'Elite' : data.trustScore >= 75 ? 'Trusted' : data.trustScore >= 50 ? 'Verified' : 'Newbie',
          completionRate: 92,
        };
        // @ts-ignore
        setUser(mockUser);
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    };
    fetchUser();
  }, [setUser, session]);

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
