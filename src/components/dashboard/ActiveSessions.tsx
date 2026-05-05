"use client";

import { Session } from "@/lib/api";
import { Calendar, Video, XCircle, Clock } from "lucide-react";
import { format, formatDistanceToNow, isFuture } from "date-fns";

export function ActiveSessions({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <div className="liquid-glass p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
        <Calendar className="w-12 h-12 text-white/20 mb-3" />
        <h3 className="text-white/95 font-medium">No upcoming sessions</h3>
        <p className="text-sm text-white/40 mt-1">Book a session to start learning.</p>
      </div>
    );
  }

  return (
    <div className="liquid-glass p-6 flex flex-col h-full relative overflow-hidden group/container">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-cyan-400/5 rounded-full blur-[40px] pointer-events-none"></div>

      <h3 className="text-lg font-semibold text-white/95 mb-4 relative z-10">Upcoming Sessions</h3>
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 relative z-10">
        {sessions.map((session) => {
          const sessionDate = new Date(session.date);
          const isUpcoming = isFuture(sessionDate);

          return (
            <div key={session.id} className="liquid-glass-static p-4 flex items-center justify-between group hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-white/10">
              <div className="flex gap-4 items-center">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 group-hover:bg-cyan-400/10 transition-colors">
                  <Video className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_3px_rgba(34,213,238,0.3)]" />
                </div>
                <div>
                  <h4 className="font-medium text-white/95">{session.skill}</h4>
                  <div className="flex items-center gap-2 text-xs text-white/65 mt-1">
                    <span>with <span className="text-white/95">{session.partnerName}</span></span>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1 text-cyan-300/90">
                      <Clock className="w-3 h-3" />
                      {format(sessionDate, "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 overflow-hidden">
                <span className="text-xs font-semibold text-cyan-300 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20 backdrop-blur-sm group-hover:translate-x-full group-hover:opacity-0 transition-all duration-300 absolute">
                  {isUpcoming ? `In ${formatDistanceToNow(sessionDate)}` : "Starting now"}
                </span>
                <div className="flex gap-2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="text-[10px] bg-red-400/5 hover:bg-red-400/10 text-red-400/80 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5 hover:border-red-400/20 transition-all uppercase tracking-wider font-semibold">
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button className="text-[10px] glass-button-primary px-4 py-1.5 rounded-full flex items-center gap-1.5 text-white/95 uppercase tracking-wider font-semibold">
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
