"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

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

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("Error playing video:", e));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari native HLS support
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(e => console.error("Error playing video:", e));
      });
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
    </div>
  );
}
