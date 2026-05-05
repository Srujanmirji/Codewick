"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        // Silently handle AbortError which occurs when play is interrupted by browser power saving
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
