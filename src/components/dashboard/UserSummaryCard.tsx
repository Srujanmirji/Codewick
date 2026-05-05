"use client";

import { useUserStore } from "@/store/useUserStore";
import { CheckCircle2, Shield, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function UserSummaryCard() {
  const { user } = useUserStore();

  if (!user) return null;

  // Dynamic trust score color logic
  let trustColorStr = "from-cyan-400 via-teal-400 to-indigo-500";
  let glowColor = "rgba(34,213,238,0.5)";
  
  if (user.trustScore >= 80) {
    trustColorStr = "from-emerald-400 via-green-400 to-teal-500";
    glowColor = "rgba(52,211,153,0.5)";
  } else if (user.trustScore < 50) {
    trustColorStr = "from-red-400 via-rose-400 to-orange-500";
    glowColor = "rgba(248,113,113,0.5)";
  }

  return (
    <div className="liquid-glass p-6 flex flex-col relative h-full group">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-[40px] pointer-events-none"></div>

      <div className="flex items-start gap-5 relative z-10">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover bg-black/20" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-fustat font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-2">
            {user.name}
            {(user.trustLevel === 'Elite' || user.trustLevel === 'Trusted') && (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,213,238,0.6)]" />
            )}
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-cyan-400/10 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mt-2 border border-cyan-400/20 backdrop-blur-md shadow-[0_0_10px_rgba(34,213,238,0.1)]">
            <Shield className="w-3.5 h-3.5" />
            {user.trustLevel} Level
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5 relative z-10">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-white/65 font-inter">Trust Score</span>
            <div className="flex flex-col items-end">
              <span className="font-fustat font-bold text-2xl bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-md">
                {user.trustScore}
                <span className="text-sm text-white/40 font-normal">/100</span>
              </span>
              <span className="text-[10px] text-cyan-400/80 font-medium">+2.3% this week</span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.trustScore}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${trustColorStr} rounded-full relative overflow-hidden`}
              style={{ boxShadow: `0 0 12px ${glowColor}` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[slow-pan_2s_linear_infinite] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-white/40">Completion Rate</span>
            <span className="font-semibold text-white/95 flex items-center gap-1 mt-0.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400/80 drop-shadow-[0_0_3px_rgba(251,191,36,0.3)]" />
              {user.completionRate}%
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-white/40">Avg Rating</span>
            <span className="font-semibold text-white/95 flex items-center justify-end gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/80 drop-shadow-[0_0_3px_rgba(251,191,36,0.3)]" />
              4.9
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
