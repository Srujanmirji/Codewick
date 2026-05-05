"use client";

import { motion } from "framer-motion";
import { HandHelping, GraduationCap, PlayCircle, ShieldAlert } from "lucide-react";

const actions = [
  { label: "Request Skill", icon: HandHelping, color: "text-cyan-400 drop-shadow-[0_0_3px_rgba(34,213,238,0.3)]", gradient: "from-cyan-400/10 to-teal-400/10" },
  { label: "Offer Skill", icon: GraduationCap, color: "text-indigo-400 drop-shadow-[0_0_3px_rgba(99,102,241,0.3)]", gradient: "from-indigo-400/10 to-purple-400/10" },
  { label: "Start Session", icon: PlayCircle, color: "text-teal-400 drop-shadow-[0_0_3px_rgba(45,212,191,0.3)]", gradient: "from-teal-400/10 to-emerald-400/10" },
  { label: "Raise Dispute", icon: ShieldAlert, color: "text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.3)]", gradient: "from-amber-400/10 to-orange-400/10" },
];

export function QuickActions() {
  return (
    <div className="liquid-glass p-6 h-full flex flex-col justify-center">
      <h3 className="text-sm font-semibold text-white/65 mb-4 uppercase tracking-widest drop-shadow-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl liquid-glass-static group relative overflow-hidden transition-all duration-300 hover:bg-white/5"
          >
            {/* Animated gradient border background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
            
            <div className="relative z-10 p-3 rounded-full bg-white/5 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10">
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <span className="text-sm font-medium text-white/65 group-hover:text-white/95 transition-colors relative z-10">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
